const jwt = require('jsonwebtoken')


let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');
    token = token.split(' ')[1];

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


module.exports = verifyToken;