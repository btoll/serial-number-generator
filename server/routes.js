module.exports = app => {
    // For CORS.
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, AuthorizationToken");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
        next();
    });

    /*
    app.get('/api/scenario', (req, res, next) => {
        res.send(mockGetAll);
        next();
    });

    app.get('/api/scenario/:id', (req, res, next) => {
        res.send(Object.assign({}, mockGetOne(req.params.id)));
        next();
    });

    app.post('/api/scenario/:scenarioName/:scenarioDescription/:monthEnd', (req, res, next) => {
        res.send(Object.assign({}, mockGetOne("f72a2e67-8d3b-429c-a630-19d75e01ae80")));
        next();
    });

    app.put('/api/scenario/:scenarioId', (req, res, next) => {
        res.send(Object.assign({}, mockGetOne(req.params.scenarioId)));
        next();
    });
    */
};

