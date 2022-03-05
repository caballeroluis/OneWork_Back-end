const { validationResult } = require('express-validator');
const loginService = require('../services/auth.service');


exports.userLogin = async (req, res, next) => {

    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {

      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {      
        let { token, refreshToken, user } = await loginService.userLogin(email, password);
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
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {

      return res.status(400).json({ errors: errors.array() });
    }

    let refreshToken = req.body.refreshToken;

    try {      
        let newToken = await loginService.letsRefreshToken(refreshToken);
        console.log(newToken);
        return res.json({token: newToken});  
    } catch(error) {
        next(error);
    }
}

exports.userLogout = async (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let id = req.user._id;
    
    try {      
        await loginService.userLogout(id);
        return res.json({});  
    } catch(error) {
        next(error);
    }
}