const express = require('express');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    // Username o email

    User.findOne({ username: body.username }, (errUser, userDB) => {

        if(errUser) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Username or password incorrect'
                }
            });
        }

        bcrypt.compare(body.password, userDB.password, function(errPass, result) {
            
            if (result === true) {
    
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
                        message: 'Username or password incorrect'
                    }
                });
            }
        })
    })

})

module.exports = app;