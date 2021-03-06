const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('dotenv').config();
require(path.join(__dirname, '/routes'))(app);

app.listen(3000, () => {
    console.log('Express listening on port 3000');
});

