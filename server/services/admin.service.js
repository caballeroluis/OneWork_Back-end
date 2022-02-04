const _ = require('underscore');

const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const Offer = require('../models/offer.model');
const { deleteFolder, deleteFile } = require('../utils/files.util');

let getOffersAdmin = async function() {
    try {
        let offer = await Offer.find({})
                               .populate({path:'workerAssigned', select: '-offers'})
                               .populate({path:'recruiterAssigned', select: '-offers'})
        if(!offer) throw {status: 400, message: 'There\'s no offers on database'}
        return offer;
    } catch(error) {
        throw error;
    }
}

let getOfferByIDAdmin = async function(id) {
    try {
        let offer = await Offer.findById(id)
                               .populate({path:'workerAssigned', select: '-offers'})
                               .populate({path:'recruiterAssigned', select: '-offers'})
        if(!offer) throw {status: 400, message: 'There\'s no offers on database'}
        return offer;
    } catch(error) {
        throw error;
    }
}

let changeStateOfferAdmin = async function(id, status) {
    try {
        // TODO: implementar lógica
        let offer = await Offer.findById(id);
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
    } catch(error) {
        throw error;
    }
}

let updateOfferAdmin = async function(id, body) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true});
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        return offer;
    } catch(error) {
        throw error;
    }
}

// TODO: pendiente de hacer la lógica.

let deleteOfferAdmin = async function(id) {
    try {
        let offer = await Offer.findById(id)
                               .populate({path:'workerAssigned'})
                               .populate({path:'recruiterAssigned'})
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};

        let indexOfferOnRecruiter = offer.recruiterAssigned.offers.indexOf(id);
        let indexOfferOnWorker = offer.workerAssigned.offers.indexOf(id);

        if (indexOfferOnRecruiter > -1) {
            offer.recruiterAssigned.offers.splice(indexOfferOnRecruiter, 1);
        }
        if (indexOfferOnWorker > -1) {
              offer.workerAssigned.offers.splice(indexOfferOnWorker, 1);
        }

        await Promise.all([offer.workerAssigned.save(), offer.recruiterAssigned.save(), offer.remove()]);
        return offer;
    } catch(error) {
        throw error;
    }
}

let updateUserAdmin = async function(body, id, role) {
    try {

        let user;

        if(role === 'worker') {
            user  = await Worker.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        } else if(role === 'recruiter') {
            user  = await Recruiter.findByIdAndUpdate(id, body, {new: true, runValidators: true})      
        } else {
            throw {status: 400, message: 'The role of the user is incorrect'};
        }
        if (!user) throw {status: 400, message: 'User doesn\'t exist'};

    } catch(error) {
        throw error;
    }
}

let getUsersAdmin = async function(role) {
    try {
        let user = await User.find({})
                             .where({role})
        if (!user.length) throw {status: 400, message: `There\'s no ${role} users on database`};
        return user;
    } catch(error) {
        throw error;
    }
}

let getUserByIDAdmin = async function(id) {
    try {
        let user = await User.findById(id)
                             .populate('offers');

        if (!user) throw {status: 400, message: 'User doesn\'t exist'};

        return user;
    } catch(error) {
        throw error;
    }
}

let deleteUserAdmin = async function() {
    try {
        let user = await User.findById(id)
                             .populate('offers');
        if (!user) throw {status: 400, message: 'User doesn\'t exist'}; 
        if(user.role === 'worker') {
            for(let offer of user.offers) {
                offer.workerAssigned = undefined;
                offer.status = 'created';
                await offer.save();
            }
        } else if(user.role === 'recruiter') {
            for (let offer of user.offers) {
                await offer.remove();
            }
        }
        await user.remove();
        return user;
    } catch(error) {

    }
}

let deleteImgAdmin = async function(id) {
    try {
        let user = await User.findById(id);
        if(!user) throw {status: 400, message: 'This user doesn\'t exist'};

        deleteFile(id, 'users', user.img);
        deleteFolder(id, 'users');
        user.img = undefined;

        await user.save();

        return user;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getOffersAdmin,
    getOfferByIDAdmin,
    changeStateOfferAdmin,
    updateOfferAdmin,
    deleteOfferAdmin,
    updateUserAdmin,
    getUsersAdmin,
    getUserByIDAdmin,
    deleteUserAdmin,
    deleteImgAdmin
}