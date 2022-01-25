// @flow
const PROTOCOL = 'http://';
//const HOST = 'em.perlara.com';
const HOST = 'localhost';
const PORT = '3000';
const DOWNLOAD_PORT = '8080';
const DOWNLOAD_PATH = `${HOST}:${DOWNLOAD_PORT}`;

const SOCKET = `${PROTOCOL}${HOST}:${PORT}`;
//const AUTH = `${SOCKET}/api/users/login`;
const CREATE_EXPERIMENT_ENDPOINT = `${SOCKET}/create-experiment`;
const LIST_EXPERIMENTS_ENDPOINT = `${SOCKET}/list-experiments`;
const LOGIN_ENDPOINT = `${SOCKET}/login`;
const NOTES_ENDPOINT = `${SOCKET}/notes`;
const PLATE_ENDPOINT = `${SOCKET}/plate`;
const PRINT_EXPERIMENT_ENDPOINT = `${SOCKET}/print-experiment`;
const REPLACE_PLATE_ENDPOINT = `${SOCKET}/replace`;
const STAGES_ENDPOINT = `${SOCKET}/stages`;
const VIEW_EXPERIMENT_ENDPOINT = `${SOCKET}/view-experiment`;

function* incrementer() {
    let n = 100;

    while (true) {
        yield n++;
    }
};

const incr = (i =>
    () => i.next().value
)(incrementer());

export {
    DOWNLOAD_PATH,
    CREATE_EXPERIMENT_ENDPOINT,
    LIST_EXPERIMENTS_ENDPOINT,
    LOGIN_ENDPOINT,
    NOTES_ENDPOINT,
    PLATE_ENDPOINT,
    PRINT_EXPERIMENT_ENDPOINT,
    REPLACE_PLATE_ENDPOINT,
    STAGES_ENDPOINT,
    VIEW_EXPERIMENT_ENDPOINT
};

