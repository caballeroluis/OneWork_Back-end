const rateLimit = require('express-rate-limit');
const { ErrorLimitRateExceeded } = require('../utils/customErrors.util');
const MongoStore = require('rate-limit-mongo');

exports.globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100000, 
    handler,
    standardHeaders: true,
    store: new MongoStore({
        uri: 'mongodb://127.0.0.1:27017/test_db',
        user: process.env.MONGO_USER || undefined,
        password: process.env.MONGO_PASS || undefined,
        expireTimeMs: 1 * 60 * 1000,
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    })
});

exports.authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 15, 
    handler,
    standardHeaders: true,
    store: new MongoStore({
        uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test_db',
        user: process.env.MONGO_USER || undefined,
        password: process.env.MONGO_PASS || undefined,
        expireTimeMs: 30 * 60 * 1000,
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    })
});

function handler(req, res, next, options) {
    next(new ErrorLimitRateExceeded('You exceed number of max requests'))
}