const express = require('express');

const verifyToken = require('../middlewares/veryfyAuth');
const { verifyRoleInitial, verifyOwnIdOrAdmin, verifyAdmin } = require('../middlewares/verifyRole');

const app = express();





module.exports = app;