const express = require('express');
const app = express();
const db = require('../queries/queries');
const {verificaToken, verificaUserRole} = require('../midlewares/midlewares');

//comenzarCarrera
//app.get('/taxista/confirmar',db.comenzarCarrera);
app.get('/taxista/:id',verificaToken,db.getDriverById);
app.get('/taxista/revisarEstadoTaxista/:id_taxista', db.revisarEstadoTaxista);

app.post('/taxista/confirmar', db.comenzarCarrera);
app.post('/taxista/terminarCarrera', db.terminarCarrera);
app.post('/taxista/registrarTaxi', db.registrarTaxi);
app.post('/taxista/comenzarServicio', db.comenzarServicio);

app.put('/taxista/terminarServicio', db.terminarServicio);
app.put('/taxista/updateTaxista', db.updateTaxista);

module.exports = app;