const express = require('express');

const Recruiter = require('../../models/recruiter');
const Worker = require('../../models/worker');
const Offer = require('../../models/offer');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyRecruiter } = require('../../middlewares/verifyRole');

const app = express();

app.post('/offer/:id', [verifyToken, verifyRecruiter], function (req, res) {

    let body = req.body;
    let id = req.params.id;

    Recruiter.findById(id, (err, recruiterDB) => {

        if(!recruiterDB) {    
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This recruiter doesn\'t exist'
                }
            })
        }

        if(err) {
            return res.status(500).json({
                ok: false,
                err
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

            recruiterDB.save((errUser, recruiterSaved) => {
                if( errUser ) {
                    offer.remove();
                    return res.status(500).json({
                        ok: false,
                        errUser
                    })
                }

                res.json({
                    ok: true,
                    recruiter: recruiterSaved._id,
                    offer: offerSaved
                })
            })
        })
    })
})



module.exports = app;