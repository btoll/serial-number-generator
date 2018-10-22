const crypto = require('crypto');
const fs = require('fs');
const sql = require('mssql');
const env = process.env;

async function connect() {
    try {
        sql.close();

        const pool = await sql.connect(
            `mssql://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_SERVER}/${env.DB_NAME}
        `);

        pool.max = 10;
        pool.min = 5;
        pool.idleTimeoutMillis = 3000;

        return pool;
    } catch (err) {
        return err;
    }
}

/*
async function get(table) {
    try {
        sql.close();
        pool = await connect();
        pool.max = 10;
        pool.min = 5;
        idleTimeoutMillis = 3000;
        return await pool.request().query(`SELECT * FROM ${table}`);
    } catch (err) {
        return err;
    }
}
*/

function generateSerialNumber(body) {
    const plateCount = body.plateCount * 1;
    const repCount = body.repCount * 1;

    // Our crypto algo will be the following:
    // 1. Hash the parts of the experiment using SHA256 hash function.
    // 2. Return a buffer, and we'll use its default view (Uint8Array).
    const hash = crypto.createHash('sha256');
    hash.update(`${body.organism}${body.disease}${body.plateCount}${body.repCount}${body.wellCount}`);
    const buf = hash.digest(); // Not specifying an encoding will return a Buffer.
    // 3. Iterate over the slice and mod 8 so every number returned is constrained from 0-7.
    // 4. Prepend `PL-` and append `-1` and send.
    const a = [];

    // TODO: This is good enough for now, but they won't be unique given the same input!

    for (let v of buf.slice(0, 8)) {
        a.push(v % 8);
    }

    return a;
}

async function getExperiment() {
    const pool = await connect();
    const diseases = await pool.request().query(`SELECT * FROM disease`);
    const organisms = await pool.request().query(`SELECT * FROM organism`);

    return {
        diseases,
        organisms
    };
}

async function listExperiments() {
    const pool = await connect();

    return await pool.request().query(`SELECT e.experiment_id, e.serial_number, o.name AS organism, d.name AS disease, e.plate_count, e.rep_count, e.well_count FROM experiment e JOIN organism o ON o.organism_id = e.organism_id JOIN disease d ON d.disease_id = e.disease_id`);
}

async function postExperiment(uid, body) {
    const pool = await connect();
    const transaction = new sql.Transaction(pool);

    transaction.begin(err => {
        // ... error checks
        console.log('err0', err);

        const request = new sql.Request(transaction)
        request.query(`INSERT INTO experiment (experiment_id, serial_number, organism_id, disease_id, plate_count, rep_count, well_count) VALUES ('${body.experimentName}-${uid}', 'PL-${uid}-x', ${Number(body.organism)}, ${Number(body.disease)}, ${Number(body.plateCount)}, ${Number(body.repCount)}, ${Number(body.wellCount)})`, (err, result) => {
            // ... error checks
            console.log('err1', err);

            transaction.commit(err => {
                // ... error checks

                console.log('err2', err);
                console.log("Transaction committed.")
            })
        })
    });
}

function printExperiment(params) {
    const {serialNumber, plateCount, repCount} = params;
    const writeStream = fs.createWriteStream(`experiments/${serialNumber}.txt`);
    const base = serialNumber.slice(0, -1);

    let k = 1;

    for (let i = 1; i <= repCount; i++) {
        writeStream.write(`\nRep ${i}\n------------------\n`);

        for (let j = 1; j <= plateCount; j++) {
            writeStream.write(`${base}${k++}\n`);
        }
    }

    writeStream.end();
}

module.exports = {
    generateSerialNumber,
    getExperiment,
    listExperiments,
    postExperiment,
    printExperiment
};

