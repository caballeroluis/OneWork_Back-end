const _ = require('underscore');

const { Worker, Recruiter } = require('../models/user');
const Offer = require('../models/offer');

let createOffer = async function(req) {
    let body = req.body;
    let idRecruiter = req.params.idRecruiter;
    let idWorker = req.params.idWorker;

    let offer = new Offer({
        salary: body.salary,
        title: body.title,
        requirements: body.requirements,
        workplaceAdress: body.workplaceAdress,
        description: body.description,
    })

    try {
        
        let recruiter = await Recruiter.findById(idRecruiter);

        if(!recruiter) {  
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This recruiter doesn\'t exist'
                }
            })
        }

        let worker = await Worker.findById(idWorker);

        if(!worker) {    
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This worker doesn\'t exist'
                }
            })
        }

        recruiter.offers.push(offer._id);
        worker.offers.push(offer._id);

        await Promise.all([offer.save(), worker.save(), recruiter.save()]);

        return offer;
    } catch(error) {
        return error;
    }
}

let updateOffer = async function(req) {
    let id = req.params.id;
    let body = _.pick(req.body, ['salary', 'title', 'requirements', 'workplaceAdress', 'description']);

    try {
        let offer = await Offer.findByIdAndUpdate(id, body, {new: true, runValidators: true});
        if(!offer) {    
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'This offer doesn\'t exist'
                }
            })
        }
        return offer;
    } catch(error) {
        return error;
    }

}

let deleteOffer = async function(req) {

    let idOffer = req.params.idO;
    let type = 'eliminated';

    try {
        let offer = await Offer.findById(idOffer);
        
        if(!offer) {    
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'This offer doesn\'t exist'
                }
            })
        }
    
        offer.status = type;
    
        await offer.save();

        return offer;
    } catch(error) {
        return error;
    }
}


module.exports = {
    createOffer,
    updateOffer,
    deleteOffer
}