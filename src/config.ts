/*
 * You can place general (server-)configurations here
 */
const IS_DEV = process.env.NODE_ENV !== 'production';

const SERVER_PORT = Number(process.env.PORT) || 3000;

const USERS_FILE = String(process.env.USERS_FILE) || "users.json";

export { IS_DEV, SERVER_PORT, USERS_FILE };
