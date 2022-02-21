const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const Offer = require('../models/offer.model');
const offerStateUtil = require('../utils/offerState.util');
const { ErrorBDEntityNotFound, OfferStatusError, UnathorizedError } = require('../utils/customErrors.util');

// TODO: Añadir el ID de worker y recruiter.

let createOffer = async function(idWorker, idRecruiter, body) {

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter)
                                       .where({active: true})
                                       .select('-active -email');
        if(!recruiter) throw new ErrorBDEntityNotFound('This recruiter doesn\'t exist');

        let worker = await Worker.findById(idWorker)
                                 .where({active: true})
                                 .select('-active -email');
        if(!worker) throw new ErrorBDEntityNotFound('This worker doesn\'t exist');
        
        let offer = new Offer({
            salary: body.salary,
            title: body.title,
            requirements: body.requirements,
            workplaceAddress: body.workplaceAddress,
            description: body.description,
            workerAssigned: worker._id,
            recruiterAssigned: recruiter._id
        });

        if(offerStateUtil.booleanOpened(offer)) {
            offer.status = 'opened';
        } else {
            offer.status = 'uncompleted';
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

let getOffers = async function() {

    try {
        let offer = await Offer.find({})
                               .where({abandoned: false})
                               .select('-abandoned')
                               .populate({path:'workerAssigned', select: '_id name creationDate img', select: '-offers -active -email'})
                               .populate({path:'recruiterAssigned', select: '_id corporationName descriptionCorporate recruiterName', select: '-offers -active -email'})
        if(!offer) throw new ErrorBDEntityNotFound('There\'s no offers on database');
        return offer;
    } catch(error) {
        throw error;
    }
}

let getOfferByID = async function(id) {

    try {
        let offer = await Offer.findById(id)
                               .where({abandoned: false})
                               .select('-abandoned')
                               .populate({path:'workerAssigned', select: '_id name creationDate img', select: '-offers -active -email'})
                               .populate({path:'recruiterAssigned', select: '_id corporationName descriptionCorporate recruiterName', select: '-offers -active -email'})
        if(!offer) throw new ErrorBDEntityNotFound('There\'s no offer on database with the ID');
        return offer;
    } catch(error) {
        throw error;
    }
}

let changeStateOffer = async function(id, userID, status) {
    try {
        let offer = await Offer.findById(id)
                               .where({abandoned: false})
                               .select('-abandoned');
        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');

        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw new OfferStatusError('You are not authorized to perform this action');

        switch(status) {
            case 'opened':
                if(!offerStateUtil.booleanOpened(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            case 'inProgress':

            break;
            case 'videoconferenceSet':
                if(!offerStateUtil.booleanVideoConferenceSet(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            case 'techinqueRevised':

            break;
            case 'accepted':
                // TODO: modificar offer accepted offerStateUtil
                if(!offerStateUtil.booleanAccepted(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            default:
                throw new OfferStatusError('The status introduced is incorrect');
        }
        
        offer.status = status;
        offer.save();

        return offer;
    } catch(error) {
        throw error
    }
}
let updateOffer = async function(id, userID, body) {
    try {
        let offer = await Offer.findById(id)
                               .where({abandoned: false})
                               .select('-abandoned');
        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');
        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw new UnathorizedError('You are not authorized to perform this action');
        
        if(body.workerAssigned) {
            let worker = await Worker.findById(body.workerAssigned);
            if(!worker) throw new ErrorBDEntityNotFound('The worker introduced doesn\'t exist');
        }

        offer.salary = body.salary || offer.salary;
        offer.title = body.title || offer.title;
        offer.requirements = body.requirements || offer.requirements;
        offer.workplaceAddress = body.workplaceAddress || offer.workplaceAddress;
        offer.description = body.description || offer.description;
        offer.workerAssigned = body.workerAssigned || offer.workerAssigned._id;
        offer.videoCallDate = body.videoCallDate || offer.videoCallDate;
        offer.videoCallLink = body.videoCallLink || offer.videoCallLink;

        if(offerStateUtil.booleanUncompleted(offer)) offer.status = 'uncompleted';
        
        if(offerStateUtil.booleanOpened(offer) && offer.status === 'uncompleted') {
            offer.status = 'opened';
        }

        offer.save();
        return offer;

    } catch(error) {
        throw error;
    }
}

let deleteOffer = async function(id, userID) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, {abandoned: true}, {new: true, runValidators: true})
                               .where({abandoned: false});
        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');
        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw new UnathorizedError('You are not authorized to perform this action');
        
        return offer;
    } catch(error) {
        throw error;
    }
}


module.exports = {
    createOffer,
    getOffers,
    getOfferByID,
    changeStateOffer,
    updateOffer,
    deleteOffer
}