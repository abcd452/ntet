const express = require('express');
const app = express();
const db = require('../queries/queries');
const {verificaToken, verificaUserRole} = require('../midlewares/midlewares');



app.get('/profile/:id',verificaToken, db.getUserById);
app.get('/profile/dirfav/:id',verificaToken, db.getDirections);
app.get('/profile/revisarEstado/:num', db.revisarEstadoUsuario);

app.post('/profile/dirfav', db.createDirFav); //updateUser
app.post('/profile/pedirCarrera', db.pedirCarrera);
app.post('/profile/confirmarCarrera', db.confirmarCarrera);
app.post('/profile/notificarCarreraTerminada', db.notificarCarreraTerminada);
app.post('/profile/calificarTaxista', db.calificarTaxista);

app.put('/profile/updateUser', db.updateUser); //Falta lo del token
app.put('/profile/updateDirFav', db.updateDirFav); //Falta lo del token

app.delete('/profile/deleteUser', db.deleteUser); //Falta lo del token
app.delete('/profile/deleteDirFav', db.deleteDirFav); //Falta lo del token :VVVV



module.exports = app;