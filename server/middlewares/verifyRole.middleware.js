const { InsufficientPermisionError } = require('../utils/customErrors.util');

let verifyOwnId = (req, res, next) => {
    const idProvided = req.params.id;
    const user = req.user;

    if (idProvided !== user._id) return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    else return next();
}


let verifyOwnIdOrRecruiter = (req, res, next) => {   
    const idProvided = req.params.id;
    const user = req.user;
    const { role } = user;
    
    if (idProvided === user._id ||
        role === 'recruiter') {
        next();
    } else {
        return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    }
}

let verifyAdmin = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'admin') return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    else return next();
}

let verifyWorker = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'worker') return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    else return next();
}

let verifyRecruiter = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'recruiter') return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    else next();
}

module.exports = {
    verifyOwnId,
    verifyOwnIdOrRecruiter,
    verifyAdmin,
    verifyWorker,
    verifyRecruiter
};
