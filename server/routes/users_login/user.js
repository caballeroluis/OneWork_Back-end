const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const verifyToken = require('../../middlewares/authentication');
const { verifyRoleInitial, verifyOwnIdOrAdmin, verifyAdmin } = require('../../middlewares/verifyRole');


const app = express();

// Queda pendiente de definir de que forma se van a introducir los usuarios.
// Por ahora pueden ser creados cualquier tipo de usuario mientras que se cree un worker o un recruiter

app.post('/user', verifyRoleInitial, function (req, res) {

    // TODO: El usuario tiene que poder subir su propia imagen.

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

    let id = req.params.id;
    let body = _.pick(req.body, ['username', 'email', 'role', 'state']);
  
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