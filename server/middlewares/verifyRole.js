
let verifyRoleInitial = (req, res, next) => {

    let body = req.body;

    if (body.role === 'RECRUITER_ROLE' || body.role === 'WORKER_ROLE') {

        next();

    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: `The role ${body.role} is invalid`
            }
        });

    }

}

let verifyOwnIdOrAdmin = (req, res, next) => {

    let idProvided = req.params.id;
    let user = req.user;

    console.log(idProvided);
    console.log(user._id);
    if (idProvided === user._id || user.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'You are not authorized to perform this action'
            }
        });

    }

}

let verifyAdmin = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'You are not authorized to perform this action'
            }
        });

    } else {

        next();

    }

}

module.exports = {

    verifyRoleInitial,
    verifyOwnIdOrAdmin,
    verifyAdmin
};