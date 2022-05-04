let booleanBacklog = function(offer) {
    if(!offer.salary ||
       !offer.title ||
       !offer.requirements ||
       !offer.workplaceAddress ||
       !offer.description ||
       !offer.workerAssigned) {
       return true;
    }    
    return false;
};

let booleanReady = function(offer) {
    if(offer.salary &&
        offer.title &&
        offer.requirements &&
        offer.workplaceAddress &&
        offer.description &&
        offer.workerAssigned) {
        return true;
    }    
    return false;
};

let booleanVideoSet = function(offer) {
    if(offer.videoCallLink &&
       offer.salary &&
       offer.title &&
       offer.requirements &&
       offer.workplaceAddress &&
       offer.description &&
       offer.workerAssigned) {
       return true;
    }
    return false;
};

let booleanTechnicianChecked = function(offer) {
    if(offer.videoCallLink &&
       offer.salary &&
       offer.title &&
       offer.requirements &&
       offer.workplaceAddress &&
       offer.description &&
       offer.workerAssigned &&
       offer.technicianChecked) {
       return true;
    }
    return false;
};

let booleanAccepted = function(offer) {
    if(offer.status === 'inProgress' ||
       offer.status === 'technicianChecked') {
        return true;
    }
    return false;
};

let booleanCheckOfferAssigned = function(userID, offer) {
    if(offer.workerAssigned._id.toString() === userID ||
       offer.recruiterAssigned._id.toString() === userID) {
        return true; 
       }
    return false;
}

module.exports = {
    booleanBacklog,
    booleanReady,
    booleanVideoSet,
    booleanTechnicianChecked,
    booleanAccepted,
    booleanCheckOfferAssigned
}