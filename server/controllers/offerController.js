let offerService = require('../services/offerService');

exports.createOffer = async (req, res) => {

    try {
        let offer = await offerService.createOffer(req);

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

    try {   
        let offer = await offerService.updateOffer(req);

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
    
    try {

        let offer = await offerService.deleteOffer(req);

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