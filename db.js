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

async function getNotes(plateID) {
    const pool = await connect();
    const result = await pool.request().query(`SELECT COUNT(*) AS totalNotes FROM notes WHERE plate_id=${plateID}`);

    if (result.recordset[0].totalNotes === 0) {
        const transaction = new sql.Transaction(pool);

        transaction.begin(err => {
            const request = new sql.Request(transaction);

            let q = `INSERT INTO notes (plate_id, stage_id, note) VALUES `
            for (let i = 1; i <= 5; i++) {
                q += `(${plateID}, ${i}, ''),`;
            }

            // Removing trailing comma.
            q = q.slice(0, -1);

            request.query(q, (err, result) => {
                transaction.commit(err => {
                    console.log(err);
                    console.log("Transaction committed.");
                });
            });
        });
    } else {
        return await pool.request().query(`SELECT * FROM notes WHERE plate_id=${plateID * 1}`);
    }

}

async function getStages() {
    const pool = await connect();

    return await pool.request().query(`SELECT * FROM stage`);
}

async function listExperiments() {
    const pool = await connect();

    return await pool.request().query(`SELECT e.experiment_id, e.experiment_name, e.serial_number, o.name AS organism, d.name AS disease, e.plate_count, e.rep_count, e.well_count FROM experiment e JOIN organism o ON o.organism_id = e.organism_id JOIN disease d ON d.disease_id = e.disease_id`);
}

async function postExperiment(uid, body) {
    const pool = await connect();
    const transaction = new sql.Transaction(pool);

    const plateCount = body.plateCount * 1;
    const repCount = body.repCount * 1;

    // https://stackoverflow.com/questions/36745952/node-mssql-transaction-insert-returning-the-inserted-id
    // https://blog.sqlauthority.com/2007/03/25/sql-server-identity-vs-scope_identity-vs-ident_current-retrieve-last-inserted-identity-of-record/
    const res = await pool.request().query(`INSERT INTO experiment (experiment_name, serial_number, organism_id, disease_id, plate_count, rep_count, well_count, last_serial_number) VALUES ('${body.experimentName}-${uid}', 'PL-${uid}-x', ${Number(body.organism)}, ${Number(body.disease)}, ${plateCount}, ${repCount}, ${Number(body.wellCount)}, ${plateCount * repCount}); SELECT SCOPE_IDENTITY() AS last_insert_id`);

    const lastInsertID = res.recordset[0].last_insert_id;
    let q = `INSERT INTO plate (experiment_id, rep, name, active_stage) VALUES `;
    let k = 1;

    for (let i = 1; i <= repCount; i++) {
        for (let j = 1; j <= plateCount; j++) {
            // See links above for how to get the last inserted id.
            q += `(${lastInsertID}, ${i}, 'PL-${uid}-${k++}', 1),`;
        }
    }

    // Removing trailing comma.
    q = q.slice(0, -1);
    await pool.request().query(q + '; SELECT SCOPE_IDENTITY() AS last_insert_id');
    return lastInsertID.toString();
}

// TODO: Next two functions should be DRY'd out!
async function printExperiment(experimentID) {
    const pool = await connect();
    const res = await pool.request().query(`SELECT * FROM plate WHERE experiment_id=${experimentID}`);
    const writeStream = fs.createWriteStream(`experiments/experiment-id-${experimentID}-x.txt`);

    for (let i = 0; i < res.recordset.length; i++) {
        writeStream.write(
            `Rep ${res.recordset[i].rep}, ${res.recordset[i].name}\n`
        );
    }

    writeStream.end();
    return res;
}

async function printExperimentSelected(experimentID, selected) {
    const pool = await connect();
    const res = await pool.request().query(`SELECT * FROM plate WHERE experiment_id=${experimentID} AND plate_id IN (${selected.join(',')})`);
    const writeStream = fs.createWriteStream(`experiments/experiment-id-${experimentID}-selected-x.txt`);

    for (let i = 0; i < res.recordset.length; i++) {
        writeStream.write(
            `Rep ${res.recordset[i].rep}, ${res.recordset[i].name}\n`
        );
    }

    writeStream.end();
    return res;
}

async function putNotes(plateID, body) {
    const pool = await connect();
    const selected = body.selected * 1;
    const notes = body.notes;

    for (let i = 0; i < 5; i++) {
//        await pool.request().query(`UPDATE notes SET note='${notes[i].note}' WHERE plate_id=${plateID} AND stage_id=${i + 1}`);
        await pool.request().query(`UPDATE notes SET note='${notes[i].note}' WHERE plate_id=${plateID} AND stage_id=${notes[i].stage_id}`);
    }

    await pool.request().query(`UPDATE plate SET active_stage=${selected} WHERE plate_id=${plateID}`);
    pool.close();
}

async function replacePlate(experimentID, plateID) {
    const pool = await connect();
    const result = await pool.request().query(`INSERT INTO replaced_plate (old_plate_id, old_experiment_id, old_name, old_active_stage) SELECT plate_id, experiment_id, name, active_stage FROM plate WHERE plate_id=${plateID}; SELECT SCOPE_IDENTITY() AS last_insert_id`);

    console.log('result', result);

    await pool.request().query(`INSERT INTO replaced_notes (old_notes_id, old_plate_id, old_stage_id, old_note) SELECT notes_id, plate_id, stage_id, note FROM notes WHERE plate_id=${plateID}`);
    await pool.request().query(`DELETE FROM notes WHERE plate_id=${plateID}`);

    const result2 = await pool.request().query(`SELECT serial_number, last_serial_number FROM experiment WHERE experiment_id=${experimentID}`);

    console.log('result2', result2);

    const incremented = result2.recordset[0].last_serial_number + 1;
    const newSerialNumber = result2.recordset[0].serial_number.slice(0, -1) + incremented;

    await pool.request().query(`UPDATE plate SET name='${newSerialNumber}', active_stage=1 WHERE plate_id=${plateID}`);
    await pool.request().query(`UPDATE experiment SET last_serial_number=${incremented} WHERE experiment_id=${experimentID}`);

    return newSerialNumber;
}

async function viewExperiment(experimentID) {
    const pool = await connect();

    // NOTE: I created the alias below (`s.name AS stage`) b/c the data was returning `p.name` and `s.name`
    // as an array, i.e.:
    //
    //          {
    //              name: ["Rep 1 PL-21612424-1", "pre"],
    //              notes: ""
    //          }
    //
    // I don't know if this is expected behavior from SQL SERVER or if this is a bug.  No time to look into it now.
    // 2018-10-22

    return await pool.request().query(`SELECT p.plate_id, p.rep, p.name, p.active_stage, s.name AS stage FROM plate p JOIN stage s ON s.stage_id = p.active_stage WHERE p.experiment_id=${Number(experimentID)}`);
}

module.exports = {
    generateSerialNumber,
    getExperiment,
    getNotes,
    getStages,
    listExperiments,
    postExperiment,
    putNotes,
    printExperiment,
    printExperimentSelected,
    replacePlate,
    viewExperiment
};

