const { User, Worker, Recruiter } = require('../models/user');
const bcryptjs = require('bcryptjs');


let createUser = async function(req) {
    const { email, password, type } = req.body;
    
    try {
        let user = await User.findOne({ email });
        
        if (user) {
            return res.status(400).json({
                ok: false,
                message: 'User already exists'
            });
        }
    
        type === 'worker' ?
        user = new Worker(req.body) :
        type === 'recruiter' ?
        user = new Recruiter(req.body) :
        res.status(400).json({ ok: false, message: 'The type of the user is incorrect'});
    
        // TODO: generar salt en variables de entorno.
    
        const salt = await bcryptjs.genSalt(11);
        user.password = await bcryptjs.hash(password, salt);
    
        await user.save();

        return user;
    } catch(error) {
        return error;
    }
}

let updateUser = async function(req) {
    const body = req.body;
    const type = body.type;
    const email = req.params.email;
    let user;
    
    try {

        type === 'worker' ?
        user = await Worker.findOneAndUpdate({email}, body, {new: true, runValidators: true}) :
        type === 'recruiter' ?
        user = await Recruiter.findOneAndUpdate({email}, body, {new: true, runValidators: true}) :
        res.status(400).json({ ok: false, message: 'The type of the user is incorrect'});

        if(!user) {    
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'This user doesn\'t exist'
                }
            })
        }

        return user;
    } catch(error) {
        return error;
    }
}

let getUserID = async function(req) {
    const email = req.params.email;

    try {

        let user = await User.findOne({email});
            if(!user) {
                return res.status(400).json({
                    ok: false,
                    message: 'The user doesn\'t exist'
                });
            }

        return user;
    } catch (error) {
        return error;
    }
}

let deleteUser = async function(req) {
    const email = req.params.email;
    try {
        let user = await User.findOneAndUpdate(email, {state: false}, {new: true, runValidators: true})
        
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'User doesn\'t exist'
            });
        }

    } catch(error) {
        return error;
    }
}




module.exports = {
    createUser,
    updateUser,
    getUserID,
    deleteUser
}