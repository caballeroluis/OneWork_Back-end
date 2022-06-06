const { validationResult } = require('express-validator');
const loginService = require('../services/auth.service');
const logGenerator = require('../utils/logGenerator.util');
const { MultipleValidationDataError } = require('../utils/customErrors.util');

exports.userLogin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true))));

    const { email, password } = req.body;

    try {      
        let { token, refreshToken, user } = await loginService.userLogin(email, password);
        logGenerator(req);
        return res.json({
            user,
            token,
            refreshToken
        });    
    } catch (error) {
        next(error);
    }
}

exports.letsRefreshToken = async function(req, res, next) {
    const refreshToken = req.body.refreshToken;

    try {      
        const newToken = await loginService.letsRefreshToken(refreshToken);
        logGenerator(req);
        return res.json({token: newToken, refreshToken});  
    } catch(error) {
        next(error);
    }
}

exports.userLogout = async (req, res, next) => {
    const id = req.user._id;
    
    try {      
        await loginService.userLogout(id);
        logGenerator(req);
        return res.json({});  
    } catch(error) {
        next(error);
    }
}