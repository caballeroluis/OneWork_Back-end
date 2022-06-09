const jwt = require('jsonwebtoken');
const { ValidationDataError } = require('../utils/customErrors.util');
const config = require('../config/env.config')

let verifyToken = (req, res, next) => {

    let token = req.get('Authorization'); 
     
    try{
        token = token.split(' ')[1];
        
    } catch(error) {
        return next(new ValidationDataError('The token is not provided or is invalid'));
    }
    
    jwt.verify(token, config.SECRET, (error, decoded) => {
        if (error) return next(error);
        req.user = decoded;
        next();

    });
};


module.exports = verifyToken;