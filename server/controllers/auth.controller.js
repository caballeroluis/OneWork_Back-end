const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const loginService = require('../services/auth.service');


exports.userLogin = async (req, res, next) => {

    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
        console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {      
        let user = await loginService.userLogin(email, password);

        const payload = {user};
    
        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600,
            },
            (error, token) => {
            if (error) throw error;
            return res.json({
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

    return res.status(501).json({ message: 'not implemented' });

    // Poner refresh token y lógica.

}