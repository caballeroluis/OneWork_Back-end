const express = require('express');

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
            return res.status(400).json({
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

            if( errRecruiter ) {
                return res.status(400).json({
                    ok: false,
                    errRecruiter
                })
            }

            if(userDB.recruiterData !== undefined) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'This user has recruiter data, please make a PUT request to modify it'
                    }
                })
            }

            userDB.recruiterData = recruiterSaved._id;

            userDB.save((errUser, userSaved) => {

                if( errUser ) {

                    recruiter.remove();
                    return res.status(400).json({
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

module.exports = app;
