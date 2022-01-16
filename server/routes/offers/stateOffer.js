const express = require('express');

const Recruiter = require('../../models/recruiter');
const Worker = require('../../models/worker');
const Offer = require('../../models/offer');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyWorker, verifyRecruiter } = require('../../middlewares/verifyRole');

const app = express();


app.put('/offer/:type/:idO', [verifyToken, verifyWorker], function (req, res) {

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

})

app.delete('/offer/:idO', [verifyToken, verifyRecruiter], function (req, res) {

    let idOffer = req.params.idO;
    let type = 'eliminated';
    
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

        offerDB.status = type;

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
    
    })
})

module.exports = app;