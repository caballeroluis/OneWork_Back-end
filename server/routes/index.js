const express = require('express');

const app = express();


app.use(require('./users_login/user'));
app.use(require('./users_login/login'));
app.use(require('./role_data/recruiter'));
app.use(require('./role_data/worker'));
app.use(require('./upload/upload'));
app.use(require('./offers/offer'));
app.use(require('./offers/stateOffer'));
app.use(require('./admin/adminUser'));
app.use(require('./admin/adminOffer'));
app.use(require('./admin/adminWorker'));
app.use(require('./admin/adminRecruiter'));


module.exports = app;