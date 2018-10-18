const sql = require('mssql');
const env = process.env;

async function connect() {
    try {
        return await sql.connect(`mssql://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_SERVER}/${env.DB_NAME}`);
    } catch (err) {
        return err;
    }
}

async function get(table) {
    try {
        sql.close();
        const pool = await connect();
        return await pool.request().query(`SELECT * FROM ${table}`);
    } catch (err) {
        return err;
    }
}

async function getDiseases() {
    return await get('disease');
}

async function getOrganisms() {
    return await get('organism');
}

module.exports = {
    getDiseases,
    getOrganisms
};

