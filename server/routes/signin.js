const express = require('express');
const app = express();
const db = require('../queries/queries');

app.post('/signin',db.createUser);



module.exports = app;