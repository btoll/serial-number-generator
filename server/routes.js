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
            next();
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
            next();
        } catch (err) {
            next(err);
        }
    });

    app.get('/notes/:plateID', async (req, res, next) => {
        try {
            res.send(await db.getNotes(req.params.plateID * 1));
            next();
        } catch (err) {
            next(err);
        }
    });

    app.put('/notes/:plateID', async (req, res, next) => {
        try {
            res.send(await db.putNotes(req.params.plateID * 1, req.body));
            next();
        } catch (err) {
            next(err);
        }
    });

    app.get('/print-experiment/:serialNumber/:plateCount/:repCount', (req, res, next) => {
        db.printExperiment(req.params);
        res.send();
        next();
    });

    app.post('/replace/:experimentID/:plateID', async (req, res, next) => {
        try {
            res.send(await db.replacePlate(req.params.experimentID * 1, req.params.plateID * 1));
            next();
        } catch (err) {
            next(err);
        }
    });

    app.get('/stages', async (req, res, next) => {
        try {
            res.send(await db.getStages());
            next();
        } catch (err) {
            next(err);
        }
    });

    app.get('/view-experiment/:experimentID', async (req, res, next) => {
        try {
            res.send(await db.viewExperiment(req.params.experimentID));
            next();
        } catch (err) {
            next(err);
        }
    });
};

