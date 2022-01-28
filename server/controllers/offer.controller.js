let offerService = require('../services/offer.service');
let Offer = require('../models/offer.model');
const _ = require('underscore');

exports.createOffer = async (req, res, next) => {

    const {idWorker, idRecruiter} = req.params;
    let body = req.body

    try {
        let offer = await offerService.createOffer(idWorker, idRecruiter, body);

        return res.json({
            ok: true,
            offer
        })
    } catch(error) {
        next(error)
    }
    
}

exports.getOffer = async (req, res, next) => {

    const id = req.params.id;

    try {
        let offer = await offerService.getOffer(id);
        if(!offer) throw 'Hola'
        return res.json(
            offer
        )
    } catch(error) {
        next(error)
    }
}

exports.updateOffer = async (req, res, next) => {

    const id = req.params.id;
    let body = _.pick(req.body, ['salary', 'title', 'requirements', 'workplaceAdress', 'description']);

    try {   
        let offer = await offerService.updateOffer(id, body);

        res.json({
            ok: true,
            offer
        })
    } catch(error) {
        next(error)
    }
}

// TODO: Refactorizar cambio de estado.

exports.changeStateOffer = async (req, res, next) => {

    let idOffer = req.params.id;
    let type = req.body.status;
    
    Offer.findById(idOffer, (errorOffer, offerDB) => {

        if(!offerDB) {    
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This offer doesn\'t exist'
                }
            })
        }

        if(errorOffer) {
            return res.status(500).json({
                ok: false,
                errWorker
            })
        }

        if(offerDB.status === 'eliminated') {
            return res.status(403).json({
                ok: false,
                err: {
                    message: 'The offer was eliminated and cannot be modified'
                }
            })
        }

        offerDB.status = type;

        switch(type) {

            case 'created':
                // Comprobar cosas
                offerDB.save((errOffer, offerSaved) => {
                    if(errOffer) {
                        return res.status(500).json({
                            ok: false,
                            errOffer
                        })
                    }

                    res.json({
                        ok: true,
                        offer: offerSaved
                    })
                })

                console.log('hola5');
            break;
            case 'completed':
                // Comprobar cosas
                offerDB.save((errOffer, offerSaved) => {
                    if(errOffer) {
                        return res.status(500).json({
                            ok: false,
                            errOffer
                        })
                    }

                    res.json({
                        ok: true,
                        offer: offerSaved
                    })
                })

                console.log('hola');

            break;
            case 'videoconferenceSet':
                // Comprobar cosas
                offerDB.save((errOffer, offerSaved) => {
                    if(errOffer) {
                        return res.status(500).json({
                            ok: false,
                            errOffer
                        })
                    }

                    res.json({
                        ok: true,
                        offer: offerSaved
                    })
                })

                console.log('hola4');
    
            break;
            case 'accepted':
                // Comprobar cosas
                offerDB.save((errOffer, offerSaved) => {
                    if(errOffer) {
                        return res.status(500).json({
                            ok: false,
                            errOffer
                        })
                    }

                    res.json({
                        ok: true,
                        offer: offerSaved
                    })
                })
                console.log('hola3');

            break;
            default:
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'The status provided is not correct'
                    }
                })
            break;
        }    

    })
}

// TODO: Eliminar también la oferta en los usuarios y completamente, o cambiar de su estado.

exports.deleteOffer = async (req, res, next) => {
    const id = req.params.id;
    let type = 'eliminated';
    try {

        let offer = await offerService.deleteOffer(id, type);
        if(!offer) throw 'Hola'
        res.json({
            ok: true,
            offer
        })
    } catch (error) {
        next(error)
    }
}