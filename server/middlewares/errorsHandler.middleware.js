const mongoose = require('mongoose');

module.exports = function(error, req, res, next) {
    console.error(error);
    switch(error.name) {
      case undefined:
        res.status(error.status).json({message: error.message});
      break;
      case 'CastError':
        res.status(400).json({message: 'The ObjectID introduced is not valid'});
      break;
      case 'ValidationError':
        res.status(400).json({message: error.message});
      break;
      case 'MongooseServerSelectionError':
        res.status(500).json({message: 'Database is not working, please, try again in few minutes'});
      break;
      case 'TokenExpiredError':
        res.status(400).json({message: error.message});
      break;
      default:
        res.status(500).json({message: 'Internal Server Error'});
      break;

    }

}
