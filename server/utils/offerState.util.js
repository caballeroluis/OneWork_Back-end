let booleanIncompleted = function(offer) {
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

let booleanOpened = function(offer) {
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

let booleanVideoConferenceSet = function(offer) {
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

let booleanAccepted = function(offer) {
    if(offer.accepted) {
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
    booleanIncompleted,
    booleanOpened,
    booleanVideoConferenceSet,
    booleanAccepted,
    booleanCheckOfferAssigned
}