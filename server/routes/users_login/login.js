const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../../models/user');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    // Username o email

    User.findOne({ email: body.email }, (errUser, userDB) => {

        if(errUser) {
            return res.status(500).json({
                ok: false,
                errUser
            });
        }

        if(!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Email or password incorrect'
                }
            });
        }

        bcrypt.compare(body.password, userDB.password, function(errPass, result) {
            
            if (result === true) {

                //TODO: que información se meterá en el jwt

                userDB = _.pick(userDB, ['_id', 'img', 'email', 'role'])

                let token = jwt.sign({
    
                    user: userDB

                    },

                    process.env.SECRET,

                    {expiresIn: '48h'}
                    
                    );
        
                res.json({
    
                    ok: true,
                    user: userDB,
                    token
                })
    
            } else {
                
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Email or password incorrect'
                    }
                });
            }
        })
    })
})

module.exports = app;
