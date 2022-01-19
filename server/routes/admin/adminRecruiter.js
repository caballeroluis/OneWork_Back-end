const express = require('express');
const _ = require('underscore');

const Recruiter = require('../../models/recruiter');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyAdmin } = require('../../middlewares/verifyRole');

const app = express();

app.get('/admin/recruiter', [verifyToken, verifyAdmin], (req, res) => {

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

app.get('/admin/recruiter/:id', [verifyToken, verifyAdmin], (req, res) => {

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


app.put('/admin/recruiter/:id/:idR', [verifyToken, verifyAdmin], function (req, res) {

    let idRecruiter = req.params.idR;

    let body = _.pick(req.body, ['corporationName', 'recruiterName', 'surname1', 'surname2', 'age', 'sex']);

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