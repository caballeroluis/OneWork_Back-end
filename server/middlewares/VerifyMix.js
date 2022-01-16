
let verifyPass = (req, res, next) => {

    let password = req.body.password;

    if(password !== undefined) {
        if(!(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{12}$/.test(password))) {
            return res.status(400).json({
                ok: false,
                message: 'The password requirements: 8 characters length, 1 letter uppercase, 1 special character and 1 number'
            });
        } else {
            next();
        }  
    } else {
        next();
    }
}

module.exports = {
    verifyPass
}