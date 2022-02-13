const adminService = require('../services/admin.service');
const { validationResult } = require('express-validator');

/* Seasson */

exports.deleteRefreshToken = async function(req, res, next) {
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let id = req.params.id;

    try {
        await adminService.deleteRefreshToken(id);
        return res.json({}); 
    } catch(error) {
        next(error);
    }
}

/* Offers */

exports.getOffersAdmin = async function(req, res, next) {
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    try {
        let offer = await adminService.getOffersAdmin();
        return res.json(offer);
    } catch(error) {
        next(error);
    }
}

exports.getOfferByIDAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let id = req.params.id;

    try {
        let offer = await adminService.getOfferByIDAdmin(id);
        return res.json(offer);
    } catch(error) {
        next(error);
    }
}

exports.changeStateOfferAdmin = async function(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let id = req.params.id;
    let status = req.body.status; 

    try {
        let offer = await adminService.changeStateOfferAdmin(id, status);
        return res.json(offer);
    } catch(error) {
        next(error);
    }
}

exports.updateOfferAdmin = async function(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let id = req.params.id;
    let body = req.body; 

    try {
        let offer = await adminService.updateOfferAdmin(id, body);
        return res.json(offer);
    } catch(error) {
        next(error);
    }
}

exports.deleteOfferAdmin = async function(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let id = req.params.id;
    
    try {
        await adminService.deleteOfferAdmin(id);
        return res.json({});
    } catch(error) {
        next(error);
    }
}

/* User */

exports.updateUserAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    const body = req.body;
    const role = req.user.role;
    const id = req.params.id;

    try {
        let user = await adminService.updateUserAdmin(body, id, role);
        return res.json(user);
    } catch(error) {
        next(error);
    }
}

exports.getUsersAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let role = req.query.role;
    
    try {
        let user = await adminService.getUsersAdmin(role);
        return res.json(user);
    } catch(error) {
        next(error);
    }
}

exports.getUserByIDAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    const id = req.params.id;

    try {
        let user = await adminService.getUserByIDAdmin(id);
        return res.json(user);

    } catch(error) {
        next(error);
    }
}

exports.deleteUserAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let id = req.params.id;

    try {
        await adminService.deleteUserAdmin(id);
        return res.json({});
    } catch(error) {
        next(error);
    }
}

/* Uploads */

exports.deleteImgAdmin = async function(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array(true)[0] });
    }

    let id = req.params.id;

    try {
        await adminService.deleteImgAdmin(id);
        return res.json({});
    } catch(error) {
        next(error);
    }
}