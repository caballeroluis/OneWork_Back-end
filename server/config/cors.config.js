const express = require('express');
const config = require('./env.config');

const app = express();

if(config.NODE_ENV === 'dev') {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
    })
}

if(process.env.NODE_ENV === 'pre') {
  app.use(function(req, res, next) {
    next();
  })
}

if(process.env.NODE_ENV === 'pro') {
  app.use(function(req, res, next) {
    next();
  })
}

module.exports = app;