const userService = require('../services/user.service')
const { validationResult } = require('express-validator');

exports.createUser = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    const body = req.body;
    const {email, password} = body;

    try { 
        let user = await userService.createUser(email, password, body);
        res.json(user);
    } catch (error) {
        next(error);
    }  
}

exports.updateUser = async (req, res, next) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }
    const body = req.body;
    const role = req.user.role;
    const id = req.params.id;

    try {
        let user = await userService.updateUser(body, id, role);
        return res.json(user);

    } catch(error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let role = req.query.role;

    try {
        let user = await userService.getUsers(role);
        return res.json(user);

    } catch(error) {
        next(error);
    }
}

exports.getUserByID = async (req, res, next) => {

    const id = req.params.id;

    try {
        let user = await userService.getUserID(id);
        return res.json(user);
    } catch(error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {

    let id = req.params.id;

    try {
        await userService.deleteUser(id);
        return res.json({});
    } catch(error) {
        next(error);
    }
}