const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const loginService = require('../services/loginService');


exports.userLogin = async (req, res) => {
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
        return res.status(500).json({
            ok: false,
            error: error
        });
    }
}
