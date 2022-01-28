const userService = require('../services/user.service')
const { validationResult } = require('express-validator');

exports.createUser = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    try { 
        let user = await userService.createUser(req);

        res.json({
            ok: true,
            user
        })
    
    } catch (error) {
        console.log(error);
        next(error)
    }  
}

exports.updateUser = async (req, res, next) => {
    try {
        let user = await userService.updateUser(req);

        return res.json({
            ok: true,
            user
        });

    } catch(error) {
        next(error)
    }
}

exports.getUserByID = async (req, res, next) => {

    try {
        
        let user = await userService.getUserID(req);

        return res.json({
            ok: true,
            user
        });

    } catch(error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req);

        return res.json({
            ok: true,
            message: 'The user has been deleted'
        });

    } catch(error) {
        next(error)
    }
}