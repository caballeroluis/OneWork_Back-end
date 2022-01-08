const express = require('express');

const verifyToken = require('../middlewares/authentication');
const { verifyRoleInitial, verifyOwnIdOrAdmin, verifyAdmin } = require('../middlewares/verifyRole');

const app = express();





module.exports = app;