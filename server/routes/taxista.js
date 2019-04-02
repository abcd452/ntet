const express = require('express');
const app = express();
const db = require('../queries/queries');
const {verificaToken, verificaUserRole} = require('../midlewares/midlewares');

//comenzarCarrera
//app.get('/taxista/confirmar',db.comenzarCarrera);
app.post('/taxista/confirmar', db.comenzarCarrera);
app.get('/taxista/:id',verificaToken,db.getDriverById);
app.post('/taxista/terminarCarrera', db.terminarCarrera);
app.post('/taxista/registrarTaxi', db.registrarTaxi);

module.exports = app;