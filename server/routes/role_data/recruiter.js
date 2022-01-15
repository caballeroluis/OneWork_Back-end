const express = require('express');
const _ = require('underscore');

const Recruiter = require('../../models/recruiter');
const User = require('../../models/user');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyRecruiter, verifyOwnIdOrAdmin } = require('../../middlewares/verifyRole');

const app = express();

app.post('/recruiter/:id', [verifyToken, verifyRecruiter, verifyOwnIdOrAdmin], function (req, res) {

    let body = req.body;
    let id = req.params.id;

    User.findById(id, (err, userDB) => {
        if(!userDB) {    
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This user doesn\'t exist'
                }
            })
        }

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        let recruiter = new Recruiter({
            corporationName: body.corporationName,
            descriptionCorporate: body.descriptionCorporate,
            international: body.international,
            recruiterName: body.recruiterName,
            recruiterSurname1: body.recruiterSurname1,
            recruiterSurname2: body.recruiterSurname2,
            contactData: body.contactData
        })
        console.log(recruiter);
        recruiter.save((errRecruiter, recruiterSaved) => {
            if(errRecruiter) {
                return res.status(500).json({
                    ok: false,
                    errRecruiter
                })
            }

            console.log(userDB.recruiterData);
            if(userDB.recruiterData !== undefined) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'This user has recruiter data, please make a recruiter PUT request to modify it'
                    }
                })
            }

            userDB.recruiterData = recruiterSaved._id;

            userDB.save((errUser, userSaved) => {
                if( errUser ) {
                    recruiter.remove();
                    return res.status(500).json({
                        ok: false,
                        errUser
                    })
                }

                userSaved.recruiterData = recruiterSaved;

                res.json({
                    ok: true,
                    user: userSaved
                })
            })
        })
    })
})

app.get('/recruiter', (req, res) => {

    Recruiter.find({}, (err, workerData) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
       
        res.json({
            ok: true,
            worker: workerData,
        })
    })

})

app.get('/recruiter/:id', (req, res) => {

    let params = req.params;

    console.log(params);

    Recruiter.findOne({_id: params.id}, (err, recruiterDB) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
       
        res.json({
            ok: true,
            recruiter: recruiterDB
        })
    })

})


app.put('/recruiter/:id/:idR', [verifyToken, verifyOwnIdOrAdmin], function (req, res) {

    let idRecruiter = req.params.id;

    let body = _.pick(req.body, ['corporationName', 'surname1', 'surname2', 'age', 'sex']);

    Recruiter.findByIdAndUpdate(idRecruiter, body, {new: true, runValidators: true}, (err, recruiterDB) => {
        
        console.log(recruiterDB);

        if(err) {
            return res.status(400).json({
                ok: false,
                err
        })}
        
        res.json({
            ok: true,
            recruiter: recruiterDB
        })
    })
})

module.exports = app;

