const logGenerator = require('../utils/logGenerator.util');

module.exports = function(error, req, res, next) {
    logGenerator(req, error);
    const msg = error.message;
    switch(error.name) {
      case 'ErrorPwdOrUserNotFound':
        res.status(error.status).json({msg});
      break;
      case 'ErrorBDEntityNotFound':
        res.status(error.status).json({msg});
      break;
      case 'ErrorBDEntityFound':
        res.status(error.status).json({msg});
      break;
      case 'UnathorizedError':
        res.status(error.status).json({msg});
      break;
      case 'OfferStatusError':
        res.status(error.status).json({msg});
      break;
      case 'ValidationDataError':
        res.status(error.status).json({msg});
        break;
      case 'MultipleValidationDataError':
        const messageErrorParsed = JSON.parse(error.message);
        res.status(error.status).json({errors: messageErrorParsed});
        break;
      case 'ValidationError':
        res.status(400).json({msg});
        break;
      case 'InsufficientPermisionError':
        res.status(error.status).json({msg});
      break;
      case 'ErrorLimitRateExceeded':
        res.status(error.status).json({msg});
      break;
      case 'MulterError':
        res.status(400).json({msg});
      break;
      case 'CastError':
        res.status(400).json({msg: 'The ObjectID introduced is not valid'});
      break;
      case 'MongooseServerSelectionError':
        res.status(500).json({msg: 'Database is not working, please, try again in few minutes'});
      break;
      case 'TokenExpiredError':
        res.status(401).json({msg});
      break;
      case 'JsonWebTokenError':
        res.status(400).json({msg});
      break;
      case 'NotBeforeError':
        res.status(400).json({msg});
      break;
      default:
        res.status(500).json({msg: 'Internal Server Error'});
      break;
    }
}