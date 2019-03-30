const express = require('express');
const app = express();
const db = require('../queries/queries');
const {verificaToken, verificaUserRole} = require('../midlewares/midlewares');

//comenzarCarrera
//app.get('/taxista/confirmar',db.comenzarCarrera);
app.post('/taxista/confirmar', db.comenzarCarrera);

module.exports = app;