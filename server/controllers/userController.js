const { Worker, Recruiter, User } = require('../models/user');

const _ = require('underscore');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    const userType = req.params.userType;
    
    try {
        
        let user = await User.findOne({ email });
    
        if (user) {
            return res.status(400).json({
                ok: false,
                message: 'User already exists'
            });
        }

        userType === 'worker' ?
        user = new Worker(req.body) :
        userType === 'recruiter' ?
        user = new Recruiter(req.body) :
        res.status(400).json({ ok: false, message: 'The type of the user is incorrect'});

        // TODO: generar salt en variables de entorno.

        const salt = await bcryptjs.genSalt(11);
        user.password = await bcryptjs.hash(password, salt);
    
        await user.save();
    
        res.json({
            ok: true,
            user
        })
    
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            error
        });  
    }  
}

exports.userLogin = async (req, res) => {
    
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {      
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Password or user is incorrect'
            });
        }

        const correctPassword = await bcryptjs.compare(password, user.password);

        if (!correctPassword) {
            return res.status(401).json({
                ok: false,
                message: 'Password or user is incorrect'
            });
        }

        user = _.pick(user, ['_id', 'img', 'email', '_type']);

        const payload = {
            user: {
                id: user.id,
                img: user.img
            },
        };
    
        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600,
            },
            (error, token) => {
            if (error) throw error;
            return res.json({
                    ok: true,
                    user,
                    token
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error
        });
    }
}

exports.getUserByID = async (req, res) => {
    let id = req.params.id;
    try {
        let user = await User.findById(id);
        if(!user) {
            return res.status(400).json({
                ok: false,
                message: 'The user doesn\'t exist'
            });
        }
        return res.json({
            ok: true,
            user
        });

    } catch(error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

exports.deleteUser = async (req, res) => {
    let id = req.params.id;
    try {

        let user = await User.findByIdAndUpdate(id, {state: false}, {new: true, runValidators: true})

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'User doesn\'t exist'
            });
        }
        return res.json({
            ok: true,
            message: 'The user has been deleted'
        });

    } catch(error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}