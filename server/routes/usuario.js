const express = require('express');
const app = express();
const db = require('../queries/queries');
const {verificaToken, verificaUserRole} = require('../midlewares/midlewares');



app.get('/profile/:id',verificaToken,db.getUserById);
app.get('/usuarios',db.getAllUsers);


module.exports = app;