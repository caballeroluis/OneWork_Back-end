const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let recruiterSchema = new Schema({

    corporationName: {
        type: String,
        autopopulate: true
    },
    descriptionCorporate: {

    },
    international: {
        type: Boolean
    },
    recruiterName: {

    },
    recruiterSurname1: {

    },
    recruiterSurname2: {

    },
    contactData: {

    },
    offersCreated: [{
        type: Schema.Types.ObjectId, 
        ref: 'Offer',
        unique: false
    }]

})
module.exports = mongoose.model('Recruiter', recruiterSchema);