const express = require('express');

const Worker = require('../../models/worker');
const User = require('../../models/user');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyWorker, verifyOwnIdOrAdmin } = require('../../middlewares/verifyRole');

const app = express();

app.post('/worker/:id', [verifyToken, verifyWorker, verifyOwnIdOrAdmin], function (req, res) {


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

        let worker = new Worker({

            name: body.name,
            surname1: body.surname1,
            surname2: body.surname2,
            age: body.age,
            sex: body.sex,
            CV: body.CV,
            offersApplied: body.offersApplied
    
        })

        console.log(worker);
        worker.save((errWorker, workerSaved) => {

            if( errWorker ) {
                return res.status(400).json({
                    ok: false,
                    errWorker
                })
            }

            if(userDB.workerData !== undefined) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'This user has recruiter data, please make a PUT request to modify it'
                    }
                })
            }

            userDB.workerData = workerSaved._id;

            userDB.save((errUser, userSaved) => {

                if( errUser ) {

                    worker.remove();
                    return res.status(400).json({
                        ok: false,
                        errUser
                    })
                }
                userSaved.workerData = workerSaved;

                res.json({
                    ok: true,
                    user: userSaved
                })
            })
        })
    })
})

module.exports = app;
