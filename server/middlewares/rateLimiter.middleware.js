const rateLimit = require('express-rate-limit');
const { ErrorLimitRateExceeded } = require('../utils/customErrors.util');
const MongoStore = require('rate-limit-mongo');
const config = require('../config/env.config');

exports.globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100000, 
    handler,
    standardHeaders: true,
    store: new MongoStore({
        uri: config.MONGO_URI_LIMITER,
        user: config.MONGO_USER,
        password: config.MONGO_PASS,
        expireTimeMs: 1 * 60 * 1000,
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    })
});

exports.authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100, 
    handler,
    standardHeaders: true,
    store: new MongoStore({
        uri: config.MONGO_URI_LIMITER,
        user: config.MONGO_USER,
        password: config.MONGO_PASS,
        expireTimeMs: 30 * 60 * 1000,
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    })
});

function handler(req, res, next, options) {
    next(new ErrorLimitRateExceeded('You exceed number of max requests'))
}