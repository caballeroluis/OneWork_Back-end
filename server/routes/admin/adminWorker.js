const express = require('express');
const _ = require('underscore');

const Worker = require('../../models/worker');
const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyAdmin } = require('../../middlewares/verifyRole');


const app = express();

app.get('/admin/worker', [verifyToken, verifyAdmin], (req, res) => {

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

app.get('/admin/worker/:id', [verifyToken, verifyAdmin], (req, res) => {

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


app.put('/admin/worker/:id', [verifyToken, verifyAdmin], function (req, res) {

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