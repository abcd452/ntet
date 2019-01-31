const express = require('express');
const app = express();
const db = require('../queries/queries');


app.get('/usuarios',db.getAllUsers);


module.exports = app;