const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const Offer = require('../models/offer.model');

// TODO: Añadir el ID de worker y recruiter.

let createOffer = async function(idWorker, idRecruiter, body) {

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter)
                                       .where({active: true});
        if(!recruiter) throw {status: 400, message: 'This recruiter doesn\'t exist'};


        let worker = await Worker.findById(idWorker)
                                 .where({active: true});
        if(!worker) throw {status: 400, message: 'This worker doesn\'t exist'};
        
        let offer = new Offer({
            creationDate: body.creationDate,
            salary: body.salary,
            title: body.title,
            requirements: body.requirements,
            workplaceAdress: body.workplaceAdress,
            description: body.description,
            workerAssigned: worker._id,
            recruiterAssigned: recruiter._id
        });

        recruiter.offers.push(offer._id);
        worker.offers.push(offer._id);

        await Promise.all([offer.save(), worker.save(), recruiter.save()]);

        worker.offers = undefined;
        recruiter.offers = undefined;
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
                               .populate({path:'workerAssigned', select: '_id name creationDate img', select: '-offers'})
                               .populate({path:'recruiterAssigned', select: '_id corporationName descriptionCorporate recruiterName', select: '-offers'})
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
                               .populate({path:'workerAssigned', select: '_id name creationDate img', select: '-offers'})
                               .populate({path:'recruiterAssigned', select: '_id corporationName descriptionCorporate recruiterName', select: '-offers'})
        if(!offer) throw {status: 400, message: 'There\'s no offers on database'}
        return offer;
    } catch(error) {
        throw error;
    }
}

let changeStateOffer = async function(id, status) {
    try {
        let offer = await Offer.findById(id)
                               .where({abandoned: false});
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
  
    } catch(error) {
        throw error
    }
}
let updateOffer = async function(id, body) {
    try {
        if(body.workerAssigned) {
            let worker = await Worker.findById(body.workerAssigned);
            if(!worker) throw {status: 400, message: 'The worker introduced doesn\'t exist'};
        }

        let offer = await Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true})
                               .where({abandoned: false});
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        return offer;
    } catch(error) {
        throw error;
    }
}

let deleteOffer = async function(id) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, {abandoned: true}, {new: true, runValidators: true})
                               .where({abandoned: false});
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
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