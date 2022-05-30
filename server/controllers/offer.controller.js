const offerService = require('../services/offer.service');
const { validationResult } = require('express-validator');
const { MultipleValidationDataError } = require('../utils/customErrors.util');
const { responseOkElementCreated, responseOk, 
        responseOkArray, responseOkElementDeleted } = require('../utils/customResponses.util');

exports.createOffer = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true)[0])));

    const { idWorker, idRecruiter } = req.params;
    const body = req.body;
    if(body.videoCallDate) body.videoCallDate = new Date(body.videoCallDate);

    try {
        let offer = await offerService.createOffer(idWorker, idRecruiter, body);
        responseOkElementCreated(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.getOffers = async (req, res, next) => {
    try {
        const offer = await offerService.getOffers();
        responseOkArray(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.getOfferByID = async (req, res, next) => {
    const id = req.params.id;

    try {
        const offer = await offerService.getOfferByID(id);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.updateOffer = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return next(new MultipleValidationDataError(JSON.stringify(errors.array(true)[0])));

    const id = req.params.id;
    const body = req.body;

    if(body.videoCallDate) body.videoCallDate = new Date(body.videoCallDate);

    try {   
        const offer = await offerService.updateOffer(id, req.user._id, body);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }
}

// TODO: Refactorizar cambio de estado.

exports.changeStateOffer = async (req, res, next) => {
    const id = req.params.id;
    const status = req.body.status;
    const role = req.user.role;
    
    try {
        const offer = await offerService.changeStateOffer(id, req.user._id, status, role);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }

}

// TODO: Eliminar también la oferta en los usuarios y completamente, o cambiar de su estado.

exports.deleteOffer = async (req, res, next) => {
    const id = req.params.id;
    try {
        await offerService.deleteOffer(id, req.user._id);
        responseOkElementDeleted(req, res);
    } catch (error) {
        next(error);
    }
}