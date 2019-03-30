const express = require('express');
const app = express();
const db = require('../queries/queries');

app.post('/login',db.loginUser);


module.exports = app;