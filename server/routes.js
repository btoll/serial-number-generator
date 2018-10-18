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
            res.send(await db.getExperiment());
        } catch (err) {
            next(err);
        }
    });

    app.post('/create-experiment', async (req, res, next) => {
        const serialNumber = db.generateSerialNumber(req.body);
        await db.postExperiment(req.body);

        res.send(`PL-${serialNumber.join('')}-1`);
        next();
    });
};

