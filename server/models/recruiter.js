const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let recruiterSchema = new Schema({

    corporationName: {
        type: String
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
        autopopulate: true
    }]

})

recruiterSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Recruiter', recruiterSchema);