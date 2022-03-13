const winston = require('winston');
const { combine, timestamp, colorize, printf, json } = winston.format;

let devLogger = {
  generalLogger: winston.createLogger({
    level: 'fatal',
    levels: {
      info: 0,
      warn: 1,
      error: 2,
      fatal: 3
    },
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      printf((info) => `${info.timestamp}, ${info.level}, ${info.message}`
    )),
    transports: [
      new winston.transports.Console()
    ],
    exceptionHandlers: [
      new winston.transports.Console()
    ],
    exitOnError: false
  }),
  devColors: {
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    fatal: 'magenta'
  }
}

let prodLogger = {
  generalLogger: winston.createLogger({
    level: 'fatal',
    levels: {
      info: 0,
      warn: 1,
      error: 2,
      fatal: 3
    },
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      json()
    ),
    transports: [
      new winston.transports.Console()
    ],
    exceptionHandlers: [
      new winston.transports.Console()
    ],
    exitOnError: false
  })
}
const logger = process.env.NODE_ENV === 'dev' ? devLogger.generalLogger : prodLogger;
process.env.NODE_ENV === 'dev' ? winston.addColors(devLogger.devColors) : winston.addColors(prodLogger);

module.exports = function logGenerator(req, error) {
  console.log(req);
  if(!error) {
    logger.info(`${req.ip}, HTTP/${req.httpVersion}, ${req.headers['user-agent']}, ${req.method}, ${req.url}`)
  } else if(error.status === 404 ||
            error.status === 401 ||
            error.status === 403) {
    logger.warn(`${req.ip}, ${error.name}, ${error.message}, HTTP/${req.httpVersion}, ${req.headers['user-agent']}, ${req.method}, ${req.url}`)
  } else if(!error.status) {
    logger.fatal(`${req.ip}, ${error.name}, ${error.message}, HTTP/${req.httpVersion}, ${req.headers['user-agent']}, ${req.method}, ${req.url}`)
  } else {
    logger.error(`${req.ip}, ${error.name}, ${error.message}, HTTP/${req.httpVersion}, ${req.headers['user-agent']}, ${req.method}, ${req.url}`)
  }
}

