const express = require('express');
const app = express();
const db = require('../queries/queries');
const {verificaToken, verificaUserRole} = require('../midlewares/midlewares');



app.get('/profile/:id',verificaToken,db.getUserById);
app.get('/profile/dirfav/:id',verificaToken,db.getDirections);
app.post('/profile/dirfav', db.createDirFav);
app.post('/profile/pedirCarrera', db.pedirCarrera); //
app.post('/profile/confirmarCarrera', db.confirmarCarrera);


module.exports = app;