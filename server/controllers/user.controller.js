const userService = require('../services/user.service')
const { validationResult } = require('express-validator');
const { MultipleValidationDataError } = require('../utils/customErrors.util');
const { responseOkElementCreated, responseOk, 
        responseOkArray, responseOkElementDeleted } = require('../utils/customResponses.util');

exports.createUser = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true)[0])));

    const body = req.body;
    const { email, password } = body;

    try { 
        let user = await userService.createUser(email, password, body);
        responseOkElementCreated(req, res, user);
    } catch (error) {
        next(error);
    }  
}

exports.updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true)[0])));

    const body = req.body;
    const role = req.user.role;
    const id = req.params.id;

    try {
        let user = await userService.updateUser(body, id, role);
        responseOk(req, res, user);
    } catch(error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true)[0])));
    
    let role;
    
    if(req.query.role) role = {$and: [{role: req.query.role}, {role:{$ne: 'admin'}}]};
    else role = {role:{$ne: 'admin'}};

    try {
        let user = await userService.getUsers(role);
        responseOkArray(req, res, user);
    } catch(error) {
        next(error);
    }
}

exports.getUserByID = async (req, res, next) => {
    const id = req.params.id;

    try {
        let user = await userService.getUserID(id);
        responseOk(req, res, user);
    } catch(error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    let id = req.params.id;

    try {
        await userService.deleteUser(id);
        responseOkElementDeleted(req, res);
    } catch(error) {
        next(error);
    }
}