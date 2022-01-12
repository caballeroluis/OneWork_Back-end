const jwt = require('jsonwebtoken')


let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;

        next();

    });


};

let verifyStatus = (req, res, next) => {

    


}


module.exports = verifyToken;