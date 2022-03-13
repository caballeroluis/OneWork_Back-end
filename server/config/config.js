const express = require('express');

const app = express();

// Establece el puerto a utilizar dependiendo de donde se ejecuta.
// TODO: mover fichero .env
process.env.PORT = process.env.PORT || 3000;

// Establece el entorno en el que estamos.

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Establece un secreto provisional para JWT.

process.env.SECRET = process.env.SECRET || '';

// Establece la política CORS siempre que el entorno sea de desarrollo.

if(process.env.NODE_ENV === 'dev') {
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
      next();
      })
}


module.exports = app;