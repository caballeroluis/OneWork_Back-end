const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const { Admin, User } = require('../models/user.model');
const Offer = require('../models/offer.model');
const refreshTokenModel = require('../models/refreshToken.model');
const { deleteFolder, deleteFile } = require('../utils/files.util');
const { ErrorBDEntityNotFound, ValidationDataError } = require('../utils/customErrors.util');
const config = require('../config/env.config');

const bcryptjs = require('bcryptjs');

let deleteRefreshToken = async function(id) {
    try {
        let refreshToken = await refreshTokenModel.findOne({user: id});
        if (!refreshToken) throw new ErrorBDEntityNotFound('This refreshToken doesn\'t exist');
        refreshToken.token = undefined;
        await refreshToken.save();
        return;
    } catch(error) {
        throw error;
    }
}

let createOfferAdmin = async function() {

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter)
                                       .where({active: true})
                                       .select('-active');
        if(!recruiter) throw new ErrorBDEntityNotFound('This recruiter doesn\'t exist');

        let worker = await Worker.findById(idWorker)
                                 .where({active: true})
                                 .select('-active');
        if(!worker) throw new ErrorBDEntityNotFound('This worker doesn\'t exist');
        
        let offer = new Offer({
            salary: body.salary,
            title: body.title,
            requirements: body.requirements,
            workplaceAddress: body.workplaceAddress,
            offerLink: body.offerLink,
            description: body.description,
            workerAssigned: worker._id,
            recruiterAssigned: recruiter._id,
            videoCallDate: body.videoCallDate,
            videoCallLink: body.videoCallLink,
            technicianChecked: body.technicianChecked
        });

        if(offerStateUtil.booleanReady(offer)) {
            offer.status = 'ready';
        } else {
            offer.status = 'backlog';
        }

        recruiter.offers.push(offer._id);
        worker.offers.push(offer._id);

        await Promise.all([offer.save(), worker.save(), recruiter.save()]);

        worker.offers = undefined;
        recruiter.offers = undefined;
        offer.abandoned = undefined;
        offer.workerAssigned = worker;
        offer.recruiterAssigned = recruiter;

        return offer;
    } catch(error) {
        throw error;
    }
}

let getOffersAdmin = async function() {
    try {
        let offer = await Offer.find({})
                               .populate({path:'workerAssigned', select: '-offers'})
                               .populate({path:'recruiterAssigned', select: '-offers'})
        if(!offer) throw new ErrorBDEntityNotFound('There\'s no offers on database');
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
        if(!offer) throw new ErrorBDEntityNotFound('There\'s no offers on database');
        return offer;
    } catch(error) {
        throw error;
    }
}

let changeStateOfferAdmin = async function(id, status) {
    try {
        let offer = await Offer.findById(id);
        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');
        
        const validStatus = ['backlog', 'ready', 'inProgress', 'videoSet', 'technicianChecked', 'accepted'];

        if(!validStatus.includes(status)) throw new OfferStatusError('The status introduced is incorrect');
        offer.status = status;

        await offer.save();
        return offer;
    } catch(error) {
        throw error;
    }
}

let updateOfferAdmin = async function(id, body) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true});
        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');
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
        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');

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

let createUserAdmin = async function(email, password, body) {
    try {
        let user = await User.findOne({ email });
        if (user) throw new ErrorBDEntityFound('Username already exists on database');

        if (body.role === 'worker') {
            user = new Worker(body);
        } else if(body.role === 'recruiter') {
            user = new Recruiter(body);
        } else if(body.role === 'admin') {
            user = new Admin(body);
        } else {
            throw new ValidationDataError('The role of the user is incorrect');
        }
        
        const salt = await bcryptjs.genSalt(config.TOKEN_SALT);
        user.password = await bcryptjs.hash(password, salt);
        
        await user.save();
        user.active = undefined;
        
        return user;
    } catch(error) {
        throw error;
    }
}

let updateUserAdmin = async function(body, id, role) {
    try {

        let user;

        if(body.email) {
            user = await User.findOne({email: body.email});
            if (user) throw new ErrorBDEntityFound('This Username exists, please change the Username provided');
        }

        if(body.password) {
            const salt = await bcryptjs.genSalt(config.TOKEN_SALT);
            body.password = await bcryptjs.hash(body.password, salt);
        }

        if(role === 'worker') {
            user = await Worker.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        } else if(role === 'recruiter') {
            user = await Recruiter.findByIdAndUpdate(id, body, {new: true, runValidators: true})      
        } else if(role === 'admin') {
            user = await Admin.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        } else {
            throw new ValidationDataError('The role of the user is incorrect');
        }

        if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist');

        return user;
    } catch(error) {
        throw error;
    }
}

let getUsersAdmin = async function(role) {
    try {
        let user = await User.find(role);
        if (!user.length) throw new ErrorBDEntityNotFound(`There\'s no ${role} users on database`);
        return user;
    } catch(error) {
        throw error;
    }
}

let getUserByIDAdmin = async function(id) {
    try {
        let user = await User.findById(id)
                             .populate('offers');
        if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist');

        return user;
    } catch(error) {
        throw error;
    }
}

let deleteUserAdmin = async function(id) {
    try {
        let user = await User.findById(id)
                             .populate('offers');
        if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist'); 
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
        if(!user) throw new ErrorBDEntityNotFound('This user doesn\'t exist');

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
    deleteRefreshToken,
    createOfferAdmin,
    getOffersAdmin,
    getOfferByIDAdmin,
    changeStateOfferAdmin,
    updateOfferAdmin,
    deleteOfferAdmin,
    updateUserAdmin,
    createUserAdmin,
    getUsersAdmin,
    getUserByIDAdmin,
    deleteUserAdmin,
    deleteImgAdmin
}