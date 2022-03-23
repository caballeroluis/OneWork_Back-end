const winston = require('winston');
const { combine, timestamp, printf, json } = winston.format;

let loggerPack = {
  humanLogger: winston.createLogger({
    level: 'fatal',
    levels: {
      info: 0,
      warn: 1,
      error: 2,
      fatal: 3
    },
    transports:
      new winston.transports.Console({
        format: combine(
          timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          printf((info) => `${info.timestamp}, ${info.level}, ${info.message}`)
        )
      }),
    exceptionHandlers: [
      new winston.transports.Console({
        format: combine(
          timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          printf((info) => `${info.timestamp}, ${info.level}, ${info.message}`)
        )
      })
    ],
    exitOnError: false
  }),
  computerLogger: winston.createLogger({
    level: 'fatal',
    levels: {
      info: 0,
      warn: 1,
      error: 2,
      fatal: 3
    },
    transports: [
      new winston.transports.File({
        filename:'./logs/combined.log',
        level: 'fatal',
        format: combine(
          timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          json()
        )
      }),
      new winston.transports.File({
        filename:'./logs/info.log',
        level: 'info',
        format: combine(
          timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          json()
        )
      })
    ],
    exceptionHandlers: 
      new winston.transports.File({
        filename: './logs/exception.log',
        format: combine(
          timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          json()
        )
      }),
    exitOnError: false
  }),
  colors: {
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    fatal: 'magenta'
  }
}

winston.addColors(loggerPack.colors);

module.exports = function logGenerator(req, error) {
  let patterns = {
    humanPattern: `${req.ip}, HTTP/${req.httpVersion}, ${req.headers['user-agent']}, ${req.method}, ${req.url}`,
    computerPattern: {
            ip: req.ip, 
            httpVersion: req.httpVersion, 
            userAgent: req.headers['user-agent'], 
            requestedMethod: req.method, 
            requestedUrl: req.url
          }
  }

  if(error) {
    patterns.humanPattern += `, ${error.name}, ${error.message}, ${error.stack}`;
    patterns.computerPattern.errorName = error.name;
    patterns.computerPattern.errorMessage = error.message;
    patterns.computerPattern.stack = error.stack;
  }

  const logger = loggerPack.humanLogger;
  const logger2 = loggerPack.computerLogger;

  if(!error) {
    logger.info(patterns.humanPattern);
    logger2.info(undefined, patterns.computerPattern)
  } else if(error.status === 404 ||
            error.status === 401 ||
            error.status === 403 ||
            error.status === 429) {
    logger.warn(patterns.humanPattern);
    logger2.warn(undefined, patterns.computerPattern);
  } else if(!error.status) {
    logger.fatal(patterns.humanPattern);
    logger2.fatal(undefined, patterns.computerPattern);
  } else {
    logger.error(patterns.humanPattern);
    logger2.error(undefined, patterns.computerPattern);
  }
}

