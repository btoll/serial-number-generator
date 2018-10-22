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
        const arr = db.generateSerialNumber(req.body);
        const uid = arr.join('');
        await db.postExperiment(uid, req.body);

        res.send(uid);
        next();
    });

    app.get('/list-experiments', async (req, res, next) => {
        try {
            res.send(await db.listExperiments());
        } catch (err) {
            next(err);
        }
    });

    app.get('/print-experiment/:serialNumber/:plateCount/:repCount', (req, res, next) => {
        db.printExperiment(req.params);
        res.send('yo');
        next();
    });
};

