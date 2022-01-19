const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../../models/user');
const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyRoleInitial, verifyOwnId } = require('../../middlewares/verifyRole');
const { verifyPass } = require('../../middlewares/VerifyMix');

const app = express();

// Queda pendiente de definir de que forma se van a introducir los usuarios.
// Por ahora pueden ser creados cualquier tipo de usuario mientras que se cree un worker o un recruiter

app.post('/user', [verifyRoleInitial, verifyPass], function (req, res) {

    
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

app.get('/user/:id', [verifyToken, verifyOwnId], (req, res) => {

    let params = req.params;

    console.log(params);

    User.findOne({_id: params.id}, (err, data) => {

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


app.put('/user/:id', [verifyToken, verifyOwnId, verifyPass], function (req, res) {

    const salt = 11;
    let id = req.params.id;

    let body = _.pick(req.body, ['email', 'password']);

    if(body.password !== undefined) {
        bcrypt.hash(body.password, salt, function(err, hash) {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })}
            
            body.password = hash;

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
          
        });
    } else {  
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
    }
})

app.delete('/user/:id', [verifyToken, verifyOwnId], function (req, res) {
    
    let id = req.params.id;

    User.findByIdAndUpdate(id, {state: false}, {new: true, runValidators: true}, (err, userDB) => {

        if( err ) {
          return res.status(400).json({
              ok: false,
              err
          })}
  
        res.json({
          ok: true,
          user: userDB
        })
    })

})

module.exports = app;
