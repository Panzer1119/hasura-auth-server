import express from "express";
import cors from "cors";
import fs from "fs";
import {SERVER_PORT, USERS_FILE} from "./config";

const app = express();

// Enable cors
app.use(cors());

// Enable JSON-parsing / processing
app.use(express.json())

app.get('/', (req, res) => res.send('Webhooks are running'));

let users: [];

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        console.error(`You need to create a "${USERS_FILE}" file`);
        return;
    }
    const rawData = fs.readFileSync(USERS_FILE, "utf-8");
    if (!rawData) {
        console.warn(`You need to have data in "${USERS_FILE}"`);
        return;
    }
    users = JSON.parse(rawData);
}

function checkUser(token: string, deny: () => void, accept: (role: string, id: number) => void) {
    loadUsers();
    if (!users) {
        deny();
        return;
    }
    const user = users.find(user => user["token"] === token);
    if (!user) {
        console.warn(`Invalid Token: "${token}"`)
        deny();
        return;
    }
    accept(user["role"], user["id"]);
}

app.get('/webhook', (request, response) => {
    // Extract token from request
    const token = request.get('Authorization') ?? "";
    checkUser(token, () => {
        response.status(401);
        response.send("Invalid Token");
    }, ((role, id) => {
        // Return appropriate response to Hasura
        response.json({
            'X-Hasura-Role': role,
            'X-Hasura-User-Id': "" + id
        });
    }));
});


const server = app.listen(SERVER_PORT, () => console.log('Your app is listening on http://localhost:' + SERVER_PORT));
