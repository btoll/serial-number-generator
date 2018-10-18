const crypto = require('crypto');
const db = require('../db');

module.exports = app => {
    // For CORS.
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, AuthorizationToken");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
        next();
    });

    app.get('/create-experiment', async (req, res, next) => {
        try {
            res.send(await db.createExperiment());
        } catch (err) {
            next(err);
        }
    });

    app.post('/create-experiment', (req, res, next) => {
        const body = req.body;
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

        // NOTE: This is good enough for now, but they won't be unique given the same input!

        for (let v of buf.slice(0, 8)) {
            a.push(v % 8);
        }

        res.send(`PL-${a.join('')}-1`);
        next();
    });
};

