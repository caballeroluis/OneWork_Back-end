const adminService = require('../services/admin.service');
const { validationResult } = require('express-validator');
const { responseOkElementCreated, responseOk, 
        responseOkArray, responseOkElementDeleted } = require('../utils/customResponses.util');
const { MultipleValidationDataError } = require('../utils/customErrors.util');
/* Seasson */

exports.deleteRefreshToken = async function(req, res, next) {
    const id = req.params.id;

    try {
        await adminService.deleteRefreshToken(id);
        responseOkElementDeleted(req, res);
    } catch(error) {
        next(error);
    }
}

/* Offers */

exports.getOffersAdmin = async function(req, res, next) {
    try {
        const offer = await adminService.getOffersAdmin();
        responseOkArray(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.getOfferByIDAdmin = async (req, res, next) => {
    const id = req.params.id;

    try {
        const offer = await adminService.getOfferByIDAdmin(id);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.changeStateOfferAdmin = async function(req, res, next) {
    const id = req.params.id;
    const status = req.body.status; 

    try {
        const offer = await adminService.changeStateOfferAdmin(id, status);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.updateOfferAdmin = async function(req, res, next) {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true))));

    const id = req.params.id;
    const body = req.body; 

    try {
        const offer = await adminService.updateOfferAdmin(id, body);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.deleteOfferAdmin = async function(req, res, next) {
    const id = req.params.id;
    
    try {
        await adminService.deleteOfferAdmin(id);
        responseOkElementDeleted(req, res);
    } catch(error) {
        next(error);
    }
}

/* User */

exports.createUserAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true))));

    const body = req.body;
    const {email, password} = body;

    try { 
        let user = await adminService.createUserAdmin(email, password, body);
        responseOkElementCreated(req, res, user);
    } catch (error) {
        next(error);
    }  
}

exports.updateUserAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true))));

    const body = req.body;
    const role = req.user.role;
    const id = req.params.id;

    try {
        const user = await adminService.updateUserAdmin(body, id, role);
        responseOk(req, res, user);
    } catch(error) {
        next(error);
    }
}

exports.getUsersAdmin = async (req, res, next) => {
    let role = req.query.role;

    if(role) role = {role: req.query.role};
    else role = {};
   
    try {
        const user = await adminService.getUsersAdmin(role);
        responseOkArray(req, res, user);
    } catch(error) {
        next(error);
    }
}

exports.getUserByIDAdmin = async (req, res, next) => {
    const id = req.params.id;

    try {
        let user = await adminService.getUserByIDAdmin(id);
        responseOk(req, res, user);
    } catch(error) {
        next(error);
    }
}

exports.deleteUserAdmin = async (req, res, next) => {
    const id = req.params.id;

    try {
        await adminService.deleteUserAdmin(id);
        responseOkElementDeleted(req, res);
    } catch(error) {
        next(error);
    }
}

/* Uploads */

exports.deleteImgAdmin = async function(req, res, next) {
    const id = req.params.id;

    try {
        await adminService.deleteImgAdmin(id);
        responseOkElementDeleted(req, res);
    } catch(error) {
        next(error);
    }
}