const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const Offer = require('../models/offer.model');
const offerStateUtil = require('../utils/offerState.util');

// TODO: Añadir el ID de worker y recruiter.

let createOffer = async function(idWorker, idRecruiter, body) {

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter)
                                       .where({active: true})
                                       .select('-active');
        if(!recruiter) throw {status: 400, message: 'This recruiter doesn\'t exist'};

        let worker = await Worker.findById(idWorker)
                                 .where({active: true})
                                 .select('-active');
        if(!worker) throw {status: 400, message: 'This worker doesn\'t exist'};
        
        let offer = new Offer({
            creationDate: body.creationDate,
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
            offer.status = 'incompleted';
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
                               .populate({path:'workerAssigned', select: '_id name creationDate img', select: '-offers -active'})
                               .populate({path:'recruiterAssigned', select: '_id corporationName descriptionCorporate recruiterName', select: '-offers -active'})
        if(!offer) throw {status: 400, message: 'There\'s no offers on database'}
        return offer;
    } catch(error) {
        throw error;
    }
}

let getOfferByID = async function(id) {

    try {
        let offer = await Offer.findById(id)
                               .where({abandoned: false})
                               .populate({path:'workerAssigned', select: '_id name creationDate img', select: '-offers -active'})
                               .populate({path:'recruiterAssigned', select: '_id corporationName descriptionCorporate recruiterName', select: '-offers -active'})
        if(!offer) throw {status: 400, message: 'There\'s no offers on database'}
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
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};

        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw {status: 403, message: 'You are not authorized to perform this action'};

        switch(status) {
            case 'opened':
                if(!offerStateUtil.booleanOpened(offer)) throw {status: 403, message: 'Requirements to change status are not accomplished'}
            break;
            case 'videoconferenceSet':
                if(!offerStateUtil.booleanVideoConferenceSet(offer)) throw {status: 403, message: 'Requirements to change status are not accomplished'}
            break;
            case 'accepted':
                if(!offerStateUtil.booleanAccepted(offer)) throw {status: 403, message: 'Requirements to change status are not accomplished'}
            break;
            default:
                return {status: 400, message: 'The status introduced is incorrect'}
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
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw {status: 403, message: 'You are not authorized to perform this action'};
        
        if(body.workerAssigned) {
            let worker = await Worker.findById(body.workerAssigned);
            if(!worker) throw {status: 400, message: 'The worker introduced doesn\'t exist'};
        }

        offer.salary = body.salary || offer.salary;
        offer.title = body.title || offer.title;
        offer.requirements = body.requirements || offer.requirements;
        offer.workplaceAdress = body.workplaceAdress || offer.workplaceAdress;
        offer.description = body.description || offer.description;
        offer.workerAssigned = body.workerAssigned || offer.workerAssigned._id;

        if(offerStateUtil.booleanIncompleted(offer)) offer.status = 'incompleted';
        
        if(offerStateUtil.booleanOpened(offer) && offer.status === 'incompleted') {
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
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        if(!offerStateUtil.booleanCheckOfferAssigned(userID, offer)) throw {status: 403, message: 'You are not authorized to perform this action'};
        
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