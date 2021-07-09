/*
 *    Copyright 2021 Paul Hagedorn (Panzer1119)
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import express from "express";
import cors from "cors";
import fs from "fs";
import {IS_DEV, SERVER_PORT, USERS_FILE} from "./config";

const app = express();

// Enable cors
app.use(cors());

// Enable JSON-parsing / processing
app.use(express.json())

app.get('/', (req, res) => res.send('Webhooks are running'));

let first = true;
let users: [];

loadUsers();

function loadUsers() {
    if (first) {
        console.debug(`IS_DEV: \"${IS_DEV}\"`);
        console.debug(`SERVER_PORT: \"${SERVER_PORT}\"`);
        console.debug(`USERS_FILE: \"${USERS_FILE}\"`);
        first = false;
    }
    if (!fs.existsSync(USERS_FILE)) {
        console.error(`You need to create a "${USERS_FILE}" file`);
        return;
    }
    if (fs.lstatSync(USERS_FILE).isDirectory()) {
        console.error(`Your file "${USERS_FILE}" is a directory`);
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
