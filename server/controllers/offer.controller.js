let offerService = require('../services/offer.service');
const { responseOkElementCreated, responseOk, 
        responseOkArray, responseOkElementDeleted } = require('../utils/customResponses.util');


exports.createOffer = async (req, res, next) => {

    const {idWorker, idRecruiter} = req.params;
    let body = req.body

    try {
        let offer = await offerService.createOffer(idWorker, idRecruiter, body);
        responseOkElementCreated(req, res, offer);
    } catch(error) {
        next(error);
    }
    
}

exports.getOffers = async (req, res, next) => {

    try {
        let offer = await offerService.getOffers();
        responseOkArray(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.getOfferByID = async (req, res, next) => {

    let id = req.params.id;

    try {
        let offer = await offerService.getOfferByID(id);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }
}

exports.updateOffer = async (req, res, next) => {

    const id = req.params.id;
    let body = req.body;

    try {   
        let offer = await offerService.updateOffer(id, req.user._id, body);
        responseOk(req, res, offer);
    } catch(error) {
        next(error);
    }
}

// TODO: Refactorizar cambio de estado.

exports.changeStateOffer = async (req, res, next) => {

    let id = req.params.id;
    let status = req.body.status;
    
    try {
        let offer = await offerService.changeStateOffer(id, req.user._id, status);
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