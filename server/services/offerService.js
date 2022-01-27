const { Worker, Recruiter } = require('../models/user');
const Offer = require('../models/offer');

let createOffer = async function(idWorker, idRecruiter, body) {
    console.log(body);
    let offer = new Offer({
        creationDate: body.creationDate,
        salary: body.salary,
        title: body.title,
        requirements: body.requirements,
        workplaceAdress: body.workplaceAdress,
        description: body.description
    });

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter);

        if(!recruiter) throw {status: 400, message: 'This recruiter doesn\'t exist'};


        let worker = await Worker.findById(idWorker);

        if(!worker) throw {status: 400, message: 'This worker doesn\'t exist'};

        recruiter.offers.push(offer._id);
        worker.offers.push(offer._id);

        await Promise.all([offer.save(), worker.save(), recruiter.save()]);

        return offer;
    } catch(error) {
        console.log(error);
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}

let updateOffer = async function(id, body) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true});
        if(!offer) throw {status: 400, message: 'This offer doesn\'t exist'};
        return offer;
    } catch(error) {
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error
        } 
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
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}


module.exports = {
    createOffer,
    updateOffer,
    deleteOffer
}