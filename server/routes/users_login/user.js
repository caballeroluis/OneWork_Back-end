const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../../models/user');
const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyRoleInitial, verifyOwnIdOrAdmin, verifyAdmin } = require('../../middlewares/verifyRole');
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
                    errData
                });
            }  
        
            res.json({
                ok: true,
                user: userDB
            })
        
        })
    });
});

app.get('/user', [verifyToken, verifyAdmin], (req, res) => {

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

app.get('/user/:id', [verifyToken, verifyOwnIdOrAdmin], (req, res) => {

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


app.put('/user/:id', [verifyToken, verifyOwnIdOrAdmin], function (req, res) {

    // TODO: El usuario no puede modificar su propio estado o rol.
    // TODO: El usuario tiene que poder modificar su propia imagen.
    // TODO: El usuario tiene que cambiar la contraseña de forma segura. 
    const salt = 11;
    let id = req.params.id;

    let body = _.pick(req.body, ['email', 'role', 'state', 'password']);

    if(body.password !== undefined) {

        // TODO: La validación de la contraseña debe hacerse antes

        if(!(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{12}$/.test(body.password))) {
        
            return res.status(400).json({
                ok: false,
                message: 'The password requirements: 8 characters length, 1 letter uppercase, 1 special character and 1 number'
            });
        }

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

app.delete('/user/:id', [verifyToken, verifyOwnIdOrAdmin], function (req, res) {
    
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
