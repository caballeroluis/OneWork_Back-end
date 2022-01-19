const express = require('express');
const _ = require('underscore');

const Recruiter = require('../../models/recruiter');
const Worker = require('../../models/worker');
const Offer = require('../../models/offer');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyRecruiter, verifyOwnId } = require('../../middlewares/verifyRole');

const app = express();

app.post('/offer/:idRecruiter/:idWorker', [verifyToken, verifyRecruiter], function (req, res) {

    let body = req.body;
    let idRecruiter = req.params.idRecruiter;
    let idWorker = req.params.idWorker;

    Recruiter.findById(idRecruiter, (errRecruiter, recruiterDB) => {

        if(!recruiterDB) {  
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This recruiter doesn\'t exist or the recruiter form it isn\'t created yet'
                }
            })
        }

        if(errRecruiter) {
            return res.status(500).json({
                ok: false,
                errRecruiter
            })
        }
        
        Worker.findById(idWorker, (errWorker, workerDB) => {

            if(!workerDB) {    
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'This worker doesn\'t exist or the worker form it isn\'t created yet'
                    }
                })
            }
    
            if(errWorker) {
                return res.status(500).json({
                    ok: false,
                    errWorker
                })
            }

            let offer = new Offer({
                salary: body.salary,
                title: body.title,
                requirements: body.requirements,
                workplaceAdress: body.workplaceAdress,
                description: body.description,
            })
            
            offer.save((errOffer, offerSaved) => {
                if(errOffer) {
                    return res.status(500).json({
                        ok: false,
                        errOffer
                    })
                }
    
                recruiterDB.offersCreated.push(offerSaved._id);
    
                recruiterDB.save((errRSaved, recruiterSaved) => {
                    if( errRSaved ) {
                        offer.remove();
                        return res.status(500).json({
                            ok: false,
                            errRSaved
                        })
                    }
    
                })

                workerDB.offersApplied.push(offerSaved._id);

                workerDB.save((errWSaved, workerSaved) => {
                    if( errWSaved ) {
                        offer.remove();
                        recruiterDB.offersCreated.pop()
                        recruiterDB.save();
                        return res.status(500).json({
                            ok: false,
                            errWSaved
                        })
                    }
    
                    res.json({
                        ok: true,
                        offer: offerSaved
                    })
                })

            })

        })

    })
})

app.put('/offer/:id', [verifyToken, verifyOwnId], function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['salary', 'title', 'requirements', 'workplaceAdress', 'description']);
  
    Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, offerDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })}

        res.json({
            ok: true,
            offer: offerDB
        })
    })
})

module.exports = app;

