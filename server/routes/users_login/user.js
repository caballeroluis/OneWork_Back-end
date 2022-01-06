const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const verifyToken = require('../../middlewares/authentication');
const verifyRoleInitial = require('../../middlewares/verifyRole');


const app = express();

// Queda pendiente de definir de que forma se van a introducir los usuarios.
// Por ahora pueden ser creados cualquier tipo de usuario mientras que sea worker o recruiter

app.post('/user', verifyRoleInitial, function (req, res) {

    let body = req.body;
    const salt = 11;

    if(!(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{12}$/.test(body.password))) {
        
        return res.status(400).json({
            ok: false,
            message: 'The password requirements: 8 characters length, 1 letter uppercase, 1 special character and 1 number'
        });
    }

    bcrypt.hash(body.password, salt, function(err, hash) {

        let user = new User({
                username: body.username,
                email: body.email,
                password: hash,
                role: body.role
            })

        user.save((errData, usuarioDB) => {

            if( errData ) {
                return res.status(400).json({
                    ok: false,
                    errData
                });
            }  
        
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        
        })
    });
});

app.get('/user', verifyToken, (req, res) => {

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

app.put('/user/:id', verifyToken, function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['username', 'email', 'role', 'state', '_id']);

  
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {



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
