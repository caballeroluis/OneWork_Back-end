const Worker = require('../models/worker.model');
const Recruiter = require('../models/recruiter.model');
const Offer = require('../models/offer.model');

// TODO: Añadir el ID de worker y recruiter.

let createOffer = async function(idWorker, idRecruiter, body) {

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter);
        if(!recruiter) throw {status: 400, message: 'This recruiter doesn\'t exist'};


        let worker = await Worker.findById(idWorker);
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

let getOffer = async function() {

    try {
        let offer = await Offer.find({});
        if(!offer) throw {status: 400, message: 'There\'s no offers on database'}
        return offer;
    } catch(error) {
        throw error;
    }
}

let updateOffer = async function(id, body) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true});
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        return offer;
    } catch(error) {
        throw error;
    }
}

let deleteOffer = async function(id, type) {

    try {
        let offer = await Offer.findById(id);
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
    
        offer.status = type;
    
        await offer.save();

        return offer;
    } catch(error) {
        throw error;
    }
}


module.exports = {
    createOffer,
    getOffer,
    updateOffer,
    deleteOffer
}