const { User } = require('./user.model');
const mongoose = require('mongoose');

let Recruiter = User.discriminator('recruiter', new mongoose.Schema({
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
        
    } 
    })
)


module.exports = Recruiter;