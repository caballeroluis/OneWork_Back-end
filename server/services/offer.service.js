const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const Offer = require('../models/offer.model');
const offerStateUtil = require('../utils/offerState.util');
const { ErrorBDEntityNotFound, UnathorizedError, 
        OfferStatusError, InsufficientPermisionError } = require('../utils/customErrors.util');

let createOffer = async function(idWorker, idRecruiter, body) {

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

let getOffers = async function() {

    try {
        let offer = await Offer.find({})
                               .where({abandoned: false})
                               .select('-abandoned -videoCallLink -videoCallDate')
                               .populate({path:'workerAssigned', select: '_id name email creationDate img', select: '-offers -active'})
                               .populate({path:'recruiterAssigned', select: '_id email corporationName international descriptionCorporate recruiterName skills', select: '-offers -active'})
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
                               .populate({path:'workerAssigned', select: '_id name email creationDate img', select: '-offers -active'})
                               .populate({path:'recruiterAssigned', select: '_id email corporationName international descriptionCorporate recruiterName skills', select: '-offers -active'})
        if(!offer) throw new ErrorBDEntityNotFound('There\'s no offer on database with the ID');
        return offer;
    } catch(error) {
        throw error;
    }
}

let changeStateOffer = async function(id, userID, status, role) {

    try {

        let offer = await Offer.findById(id)
                               .where({abandoned: false})
                               .select('-abandoned');

        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');
        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw new InsufficientPermisionError('You are not authorized to perform this action');
        
        switch(status) {
            case 'ready':
                if(!offerStateUtil.booleanReady(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            case 'inProgress':
                if(!offerStateUtil.booleanReady(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            case 'videoSet':
                if(!offerStateUtil.booleanVideoSet(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            case 'technicianChecked':
                if(!offerStateUtil.booleanTechnicianChecked(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            case 'accepted':
                if(role !== 'recruiter') throw new UnathorizedError('You are not authorized to perform this action');
                if(!offerStateUtil.booleanAccepted(offer)) throw new OfferStatusError('Requirements to change status are not accomplished');
            break;
            default:
                throw new OfferStatusError('The status introduced is incorrect');
            }
        
        offer.status = status;
        await offer.save();
        
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
        offer.offerLink = body.offerLink || offer.offerLink;
        offer.description = body.description || offer.description;
        offer.workerAssigned = body.workerAssigned || offer.workerAssigned._id;
        offer.videoCallDate = body.videoCallDate || offer.videoCallDate;
        offer.videoCallLink = body.videoCallLink || offer.videoCallLink;
        offer.technicianChecked = body.technicianChecked || offer.technicianChecked;

        if(offerStateUtil.booleanBacklog(offer)) offer.status = 'backlog';
        
        if(offerStateUtil.booleanReady(offer) && offer.status === 'backlog') {
            offer.status = 'ready';
        }

        offer.save();
        return offer;

    } catch(error) {
        throw error;
    }
}

let deleteOffer = async function(id, userID) {
    try {
        const offer = await Offer.findById(id)
                                 .where({abandoned: false})
                                 .select('-abandoned')
                                 .populate({path:'workerAssigned'})
                                 .populate({path:'recruiterAssigned'});
        if(!offer) throw new ErrorBDEntityNotFound('This offer doesn\'t exist');
        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw new UnathorizedError('You are not authorized to perform this action');
        
        const indexOfferOnRecruiter = offer.recruiterAssigned.offers.indexOf(id);
        const indexOfferOnWorker = offer.workerAssigned.offers.indexOf(id);

        if (indexOfferOnRecruiter > -1) offer.recruiterAssigned.offers.splice(indexOfferOnRecruiter, 1);
        if (indexOfferOnWorker > -1) offer.workerAssigned.offers.splice(indexOfferOnWorker, 1);

        await Promise.all([offer.workerAssigned.save(), offer.recruiterAssigned.save(), offer.remove()]);
        
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