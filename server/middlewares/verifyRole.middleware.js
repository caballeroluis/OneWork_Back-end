const { InsufficientPermisionError } = require('../utils/customErrors.util');

const verifyOwnId = (req, res, next) => {
    const idProvided = req.params.id;
    const user = req.user;

    if (idProvided !== user._id) return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    else return next();
}


const verifyOwnIdOrRecruiter = (req, res, next) => {   
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

const verifyAdmin = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'admin') return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    else return next();
}

const verifyWorker = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'worker') return next(new InsufficientPermisionError('You are not authorized to perform this action'));
    else return next();
}

const verifyRecruiter = (req, res, next) => {
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
