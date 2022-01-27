const { User, Worker, Recruiter } = require('../models/user');
const bcryptjs = require('bcryptjs');


let createUser = async function(req) {
    const { email, password, type } = req.body;
    
    try {
        let user = await User.findOne({ email });

        if (user) throw {status: 400, message: 'User already exists'};

        if (type === 'worker') {
            user = new Worker(req.body)
        } else if(type === 'recruiter') {
            user = new Recruiter(req.body)
        } else {
            throw {status: 400, message: 'The type of the user is incorrect'}
        }
        
        // TODO: generar salt en variables de entorno.
    
        const salt = await bcryptjs.genSalt(11);
        user.password = await bcryptjs.hash(password, salt);
    
        await user.save();

        return user;
    } catch(error) {
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}

let updateUser = async function(req) {
    const body = req.body;
    const type = body.type;
    const id = req.params.id;
    let user;
    
    try {
        if (type === 'worker') {
            user = await Worker.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        } else if(type === 'recruiter') {
            user = await Recruiter.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        } else {
            throw {status: 400, message: 'The type of the user is incorrect'}
        }

        if (!user) throw {status: 400, message: 'User doesn\'t exist'};

        return user;
    } catch(error) {
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}

let getUserID = async function(req) {
    const id = req.params.id;

    try {

        let user = await User.findById(id);

        if (!user) throw {status: 400, message: 'User doesn\'t exist'};

        return user;
    } catch (error) {
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}

let deleteUser = async function(req) {
    let id = req.params.id;
    try {
        let user = await User.findOneAndUpdate(id, {state: false}, {new: true, runValidators: true})
        if (!user) throw {status: 400, message: 'User doesn\'t exist'};
    } catch(error) {
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}




module.exports = {
    createUser,
    updateUser,
    getUserID,
    deleteUser
}