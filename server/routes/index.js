const express = require('express');

const app = express();


app.use(require('./users_login/user'));
app.use(require('./users_login/login'));
app.use(require('./offer'));


module.exports = app;