
const express = require('express');

const Worker = require('../../models/worker');
const User = require('../../models/user');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyWorker, verifyRecruiter, verifyOwnIdOrRecruiterOrAdmin, verifyOwnIdOrAdmin } = require('../../middlewares/verifyRole');

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

            if(errWorker) {
                return res.status(500).json({
                    ok: false,
                    errWorker
                })
            }

            if(userDB.workerData !== undefined) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'This user has recruiter data, please make a worker PUT request to modify it'
                    }
                })
            }

            userDB.workerData = workerSaved._id;

            userDB.save((errUser, userSaved) => {
                if( errUser ) {
                    worker.remove();
                    return res.status(500).json({
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

app.get('/worker', [verifyToken, verifyRecruiter], (req, res) => {

    Worker.find({}, (err, workerData) => {
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

app.get('/worker/:id', [verifyToken, verifyOwnIdOrRecruiterOrAdmin], (req, res) => {

    let params = req.params;

    Worker.findOne({_id: params.id}, (err, workerData) => {
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


app.put('/worker/:id', [verifyToken, verifyOwnIdOrAdmin], function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'surname1', 'surname2', 'age', 'sex']);
  
    Worker.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, workerDB) => {

      if(err) {
        return res.status(400).json({
            ok: false,
            err
        })}

      res.json({
        ok: true,
        worker: workerDB
      })
    })
})

module.exports = app;
