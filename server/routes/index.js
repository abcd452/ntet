const express = require('express');
const app = express();


app.use(require('./signin'));
app.use(require('./login'));

module.exports = app;
