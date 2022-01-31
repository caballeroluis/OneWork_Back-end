let offerService = require('../services/offer.service');
let Offer = require('../models/offer.model');
const _ = require('underscore');

exports.createOffer = async (req, res, next) => {

    const {idWorker, idRecruiter} = req.params;
    let body = req.body

    try {
        let offer = await offerService.createOffer(idWorker, idRecruiter, body);

        return res.json(offer)
    } catch(error) {
        next(error)
    }
    
}

exports.getOffers = async (req, res, next) => {

    try {
        let offer = await offerService.getOffers();
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        return res.json(offer)
    } catch(error) {
        next(error)
    }
}

exports.updateOffer = async (req, res, next) => {

    const id = req.params.id;
    let body = _.pick(req.body, ['salary', 'title', 'requirements', 'workplaceAdress', 'description']);

    try {   
        let offer = await offerService.updateOffer(id, body);
        res.json({offer, message: 'The offer was successful saved'})
    } catch(error) {
        next(error)
    }
}

// TODO: Refactorizar cambio de estado.

exports.changeStateOffer = async (req, res, next) => {

    let id = req.params.id;
    let status = req.body.status;
    
    try {
        let offer = await offerService.changeStateOffer(id, status);

        res.json({offer, message: 'State changed'})

    } catch(error) {
        next(error)
    }

}

// TODO: Eliminar también la oferta en los usuarios y completamente, o cambiar de su estado.

exports.deleteOffer = async (req, res, next) => {
    const id = req.params.id;
    let type = 'eliminated';
    try {
        let offer = await offerService.deleteOffer(id, type);
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        res.json(offer)
    } catch (error) {
        next(error)
    }
}