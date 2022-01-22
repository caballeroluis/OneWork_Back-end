const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../../models/user');
const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyAdmin, verifyRoleInitial } = require('../../middlewares/verifyRole');
const { verifyPass } = require('../../middlewares/VerifyMix');

const app = express();

app.post('/admin/user', [verifyRoleInitial, verifyAdmin, verifyPass], function (req, res) {

    
    let body = req.body;
    // TODO: meter el salt en variables de entorno
    const salt = 11;

    bcrypt.hash(body.password, salt, function(err, hash) {

        let user = new User({

                email: body.email,
                password: hash,
                role: body.role

            })

        user.save((errData, userDB) => {

            if( errData ) {
                return res.status(400).json({
                    ok: false,
                    error: {

                    }
                });
            }  
        
            res.json({
                ok: true,
                user: userDB
            })
        
        })
    });
});

app.get('/admin/user', [verifyToken, verifyAdmin], (req, res) => {

    User.find({}, (err, data) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
       
        res.json({
            ok: true,
            user: data,
        })
    })

})

app.put('/admin/user/:id', [verifyToken, verifyAdmin, verifyPass], function (req, res) {

    let id = req.params.id;

    let body = _.pick(req.body, ['email', 'role', 'state']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (errDB, userDB) => {
        
        if(errDB) {
            return res.status(400).json({
                ok: false,
                errDB
            })}
      
        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.delete('/admin/user/:id', [verifyToken, verifyAdmin], function (req, res) {
    
    let id = req.params.id;

    User.findByIdAndDelete(id, {state: false}, {new: true, runValidators: true}, (err, userDB) => {

        if( err ) {
          return res.status(400).json({
              ok: false,
              err
          })}
  
        res.json({
          ok: true,
          user: userDB,
          message: 'El usuario ha sido completamente eliminado'
        })
    })

})

module.exports = app;