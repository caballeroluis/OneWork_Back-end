const logGenerator = require('../utils/logGenerator.util');

module.exports = function(error, req, res, next) {
    logGenerator(req, error);
    switch(error.name) {
      case 'ErrorPwdOrUserNotFound':
        res.status(error.status).json({message: error.message});
      break;
      case 'ErrorBDEntityNotFound':
        res.status(error.status).json({message: error.message});
      break;
      case 'ErrorBDEntityFound':
        res.status(error.status).json({message: error.message});
      break;
      case 'UnathorizedError':
        res.status(error.status).json({message: error.message});
      break;
      case 'OfferStatusError':
        res.status(error.status).json({message: error.message});
      break;
      case 'ValidationDataError':
        res.status(error.status).json({message: error.message});
      break;
      case 'InsufficientPermisionError':
        res.status(error.status).json({message: error.message});
      break;
      case 'MulterError':
        res.status(400).json({message: error.message});
      break;
      case 'CastError':
        res.status(400).json({message: 'The ObjectID introduced is not valid'});
      break;
      case 'MongooseServerSelectionError':
        res.status(500).json({message: 'Database is not working, please, try again in few minutes'});
      break;
      case 'TokenExpiredError':
        res.status(401).json({message: error.message});
      break;
      case 'JsonWebTokenError':
        res.status(400).json({message: error.message});
      break;
      case 'NotBeforeError':
        res.status(400).json({message: error.message});
      break;
      default:
        res.status(500).json({message: 'Internal Server Error'});
      break;
    }
}