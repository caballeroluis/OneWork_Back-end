const express = require('express');

const app = express();


app.use(require('./users_login/user'));
app.use(require('./users_login/login'));
app.use(require('./role_data/recruiter'));
app.use(require('./role_data/worker'));

app.use(require('./upload'));
app.use(require('./offers/offer'));


module.exports = app;