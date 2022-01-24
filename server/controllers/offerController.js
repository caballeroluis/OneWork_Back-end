const _ = require('underscore');

const { Worker, Recruiter } = require('../models/user');
const Offer = require('../models/offer');


exports.createOffer = async (req, res) => {

    let body = req.body;
    let idRecruiter = req.params.idRecruiter;
    let idWorker = req.params.idWorker;

    let offer = new Offer({
        salary: body.salary,
        title: body.title,
        requirements: body.requirements,
        workplaceAdress: body.workplaceAdress,
        description: body.description,
    })

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter);

        if(!recruiter) {  
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This recruiter doesn\'t exist'
                }
            })
        }

        let worker = await Worker.findById(idWorker);

        if(!worker) {    
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This worker doesn\'t exist'
                }
            })
        }

        recruiter.offers.push(offer._id);
        worker.offers.push(offer._id);

        await Promise.all([offer.save(), worker.save(), recruiter.save()]);

        return res.json({
            ok: true,
            offer
        })

    } catch(error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            error
        })
    }
    
}

exports.updateOffer = async (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['salary', 'title', 'requirements', 'workplaceAdress', 'description']);
  
    try {
        let offer = await Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true});

        res.json({
            ok: true,
            offer
        })

    } catch(error) {
        res.status(400).json({
            ok: false,
            error
        })
    }
}

// TODO: Refactorizar cambio de estado.

exports.changeStateOffer = async (req, res) => {

    let idOffer = req.params.idO;
    let type = req.params.type;
    
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

exports.deleteOffer = async (req, res) => {
    
    let idOffer = req.params.idO;
    let type = 'eliminated';
    
    try {

        let offer = await Offer.findById(idOffer);
    
        if(!offer) {    
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'This offer doesn\'t exist'
                }
            })
        }

        offer.status = type;

        await offer.save();

        res.json({
            ok: true,
            offer
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }
}