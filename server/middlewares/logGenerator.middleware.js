const RequestIp = require('@supercharge/request-ip');
const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

exports.errorLog = function(error, req, res, next) {    
  const ip = RequestIp.getClientIp(req);  
  const logger = winston.createLogger({
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      printf((info) => `${info.timestamp}, ${info.level}, ${ip}, HTTP/${req.httpVersion}, ${req.headers['user-agent']}, ${req.method}, ${req.url}, ${error.name}, ${error.status}, ${info.message}`)
    ),
    transports: [
      new winston.transports.Console()
    ],
    exceptionHandlers: [
      new winston.transports.Console()
    ],
    exitOnError: false
  });

  logger.error(error.message);
  next(error);
}

exports.infoLog = function(req, res, next) {
  const ip = RequestIp.getClientIp(req);
  const logger = winston.createLogger({
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      printf((info) => `${info.timestamp}, ${info.level}, ${ip}, HTTP/${req.httpVersion}, ${req.headers['user-agent']}, ${req.method}, ${req.url}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
  });

  logger.info();
  next();
}
 