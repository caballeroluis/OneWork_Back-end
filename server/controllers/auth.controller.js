const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const loginService = require('../services/auth.service');


exports.userLogin = async (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {      
        
        let user = await loginService.userLogin(req);

        const payload = {
            user: {
                id: user.id,
                img: user.img
            },
        };
    
        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600,
            },
            (error, token) => {
            if (error) throw error;
            return res.json({
                    ok: true,
                    user,
                    token
            });
        });
    } catch (error) {
        next(error);
    }
}

exports.userLogout = async (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {      
        
        let user = await loginService.userLogin(req);

        const payload = {
            user: {
                id: user.id,
                img: user.img
            },
        };
        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600,
            },
            (error, token) => {
            if (error) throw error;
            return res.json({
                    ok: true,
                    user,
                    token
            });
        });
    } catch (error) {
        next(error);
    }
}