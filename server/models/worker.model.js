const { User } = require('./user.model');
const mongoose = require('mongoose');

let Worker = User.discriminator('worker', new mongoose.Schema({
    name: {
        type: String
    },
    surname1: {
        
    },
    surname2: {
        
    },
    sex: {
        
    },
    age: {
        
    },
    DNI: {
        
    },
    contactData: {
        
    }})
)

module.exports = Worker;
