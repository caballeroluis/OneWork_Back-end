const { User } = require('../models/user.model');
const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const refreshToken = require('../models/refreshToken.model');
const { deleteFolder, deleteFile } = require('../utils/files.util');
const { ErrorBDEntityFound, ErrorBDEntityNotFound, ValidationDataError } = require('../utils/customErrors.util');

const bcryptjs = require('bcryptjs');
const crypto = require('crypto');


let createUser = async function(email, password, body) {
    try {
        let user = await User.findOne({ email });
        if (user) throw new ErrorBDEntityFound('Email already exists on database');

        if (body.role === 'worker') {
            user = new Worker(body)
        } else if(body.role === 'recruiter') {
            user = new Recruiter(body)
        } else {
            throw new ValidationDataError('The role of the user is incorrect');
        }
        
        // TODO: generar salt en variables de entorno.
    
        const salt = await bcryptjs.genSalt(11);
        user.password = await bcryptjs.hash(password, salt);
        
        await user.save();
        user.active = undefined;
        
        return user;
    } catch(error) {
        throw error;
    }
}

let updateUser = async function(body, id, role) {
    try {
        
        let user;

        if(body.email) {
            user = await User.findOne({email: body.email});
            if (user) throw new ErrorBDEntityFound('This email exists, please change the email provided');
        }

        if(body.password) {
            //TODO: cambiar salt y además se debería cambiar la contraseña del Token
            const salt = await bcryptjs.genSalt(11);
            body.password = await bcryptjs.hash(body.password, salt);
        }

        if(role === 'worker') {
            user  = await Worker.findByIdAndUpdate(id, body, {new: true, runValidators: true})
                                .where({active: true})
                                .select('-active');
        } else if(role === 'recruiter') {
            user  = await Recruiter.findByIdAndUpdate(id, body, {new: true, runValidators: true})
                                   .where({active: true})
                                   .select('-active');        
        } else {
            throw new ValidationDataError('The role of the user is incorrect');
        }
        if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist');

        return user;

    } catch(error) {
        throw error;
    }
}

let getUsers = async function(role = {}) {
    try {
        let user = await User.find(role)
                             .where({active: true})
                             .select('_id name creationDate img corporationName descriptionCorporate recruiterName');
        if (!user) throw new ErrorBDEntityNotFound(`There\'s no ${role} users on database`);

        return user;
    } catch (error) {
        throw error;
    }
}

let getUserID = async function(id) {
    try {
        let user = await User.findById(id)
                             .where({active: true})
                             .populate({path:'offers', select: '-abandoned'})
                             .select('-active');

        if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist');

        return user;
    } catch (error) {
        throw error;
    }
}

let deleteUser = async function(id) {
    try {
        let user = await User.findById(id)
                             .populate('offers')
                             .where({active: true});
        if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist');
        let refreshTokenExists = await refreshToken.findOne(user._id);

        if(user.role === 'worker') {
            for(let offer of user.offers) {
                offer.workerAssigned = undefined;
                offer.status = 'backlog';
                await offer.save();
            }
        } else if(user.role === 'recruiter') {
            for (let offer of user.offers) {
                offer.abandoned = true;
                await offer.save();
            }
        }

        user.img = undefined;
        deleteFile(id, 'users', user.img);
        deleteFolder(id, 'users');
        user.active = false;
        user.email = user.email + '-' 
                     + crypto.randomBytes(12).toString('hex') + '-' 
                     + new Date().getMilliseconds();

        Promise.all([await user.save(), await refreshTokenExists.delete()]);

        return user;

    } catch(error) {
        throw error;
    }
}




module.exports = {
    createUser,
    updateUser,
    getUsers,
    getUserID,
    deleteUser
}