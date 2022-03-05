const { InsufficientPermisionError } = require('../utils/customErrors.util');

let verifyOwnId = (req, res, next) => {

    let idProvided = req.params.id;
    let user = req.user;

    if (idProvided === user._id) {
        next();
    } else {
        return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    }
}


let verifyOwnIdOrRecruiter = (req, res, next) => {
    
    let idProvided = req.params.id;
    let user = req.user;

    if (idProvided === user._id ||
        user.role === 'recruiter') {
        next();
    } else {
        return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    }
}

let verifyAdmin = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'admin') {
        return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    } else {
        next();
    }
}

let verifyWorker = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'worker') {
        return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    } else {
        next();
    }
}

let verifyRecruiter = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'recruiter') {
        return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    } else {
        next();
    }
}

module.exports = {
    verifyOwnId,
    verifyOwnIdOrRecruiter,
    verifyAdmin,
    verifyWorker,
    verifyRecruiter
};
