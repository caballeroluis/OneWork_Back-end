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
        if (user) throw new ErrorBDEntityFound('Username already exists on database');

        if (body.role === 'worker') {
            user = new Worker(body)
        } else if(body.role === 'recruiter') {
            user = new Recruiter(body)
        } else {
            throw new ValidationDataError('The role of the user is incorrect');
        }
        
        // TODO: generar salt en variables de entorno.
    
        const salt = await bcryptjs.genSalt(process.env.TOKEN_SALT);
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
            if (user) throw new ErrorBDEntityFound('This Username exists, please change the Username provided');
        }

        if(body.password) {
            const salt = await bcryptjs.genSalt(process.env.TOKEN_SALT);
            body.password = await bcryptjs.hash(body.password, salt);
        }

        if(role === 'worker') {
            user  = await Worker.findByIdAndUpdateActivesNoShowActives(id, body);
        } else if(role === 'recruiter') {
            user  = await Recruiter.findByIdAndUpdateActivesNoShowActives(id, body);       
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
                             .select('_id name email creationDate img corporationName descriptionCorporate recruiterName verified');
        if (!user) throw new ErrorBDEntityNotFound(`There\'s no ${role} users on database`);

        return user;
    } catch (error) {
        throw error;
    }
}

let getUserID = async function(id) {
    try {
        let user = await User.findByIdActivesNoShowActives(id)
                             .populate({path:'offers', select: '-abandoned'})
                             
        if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist');

        return user;
    } catch (error) {
        throw error;
    }
}

let deleteUser = async function(id) {
    try {
        let user = await User.findByIdActivesShowActives(id)
                             .populate('offers')

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