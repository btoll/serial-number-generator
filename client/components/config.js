// @flow
const PROTOCOL = 'http://';
const HOST = 'localhost';
const PORT = '3000';

const SOCKET = `${PROTOCOL}${HOST}:${PORT}`;
//const AUTH = `${SOCKET}/api/users/login`;
const LOGIN_ENDPOINT = `${SOCKET}/login`;
const CREATE_EXPERIMENT_ENDPOINT = `${SOCKET}/create-experiment`;
const LIST_EXPERIMENTS_ENDPOINT = `${SOCKET}/list-experiments`;
const PRINT_EXPERIMENT_ENDPOINT = `${SOCKET}/print-experiment`;

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
    LOGIN_ENDPOINT,
    CREATE_EXPERIMENT_ENDPOINT,
    LIST_EXPERIMENTS_ENDPOINT,
    PRINT_EXPERIMENT_ENDPOINT
};

