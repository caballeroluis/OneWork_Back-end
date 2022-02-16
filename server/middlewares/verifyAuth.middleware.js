const jwt = require('jsonwebtoken');
const { ValidationDataError } = require('../utils/customErrors.util');

let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');  
    try{
        token = token.split(' ')[1];
    } catch(error) {
        next(new ValidationDataError('The token is not provided or is invalid'));
    }
    
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) return next(error);
        req.user = decoded;
        next();

    });
};


module.exports = verifyToken;