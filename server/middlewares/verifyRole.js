
let verifyRoleInitial = (req, res, next) => {

    let body = req.body;
    console.log(body);
    if (body.role !== 'RECRUITER_ROLE') {

        return res.status(401).json({
            ok: false,
            err: {
                message: `The role ${body.role} is invalid`
            }
        });

    } else {

        next();

    }


}

module.exports = verifyRoleInitial;