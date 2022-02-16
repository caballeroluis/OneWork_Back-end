const { User } = require('./user.model');
const mongoose = require('mongoose');

let Recruiter = User.discriminator('recruiter', new mongoose.Schema({
    corporationName: {
        type: String
    },
    descriptionCorporate: {
        type: String
    },
    international: {
        type: Boolean
    },
    recruiterName: {
        type: String
    },
    recruiterSurname1: {
        type: String
    },
    recruiterSurname2: {
        type: String
    },
    contactData: {
        type: String
    } 
    })
)


module.exports = Recruiter;