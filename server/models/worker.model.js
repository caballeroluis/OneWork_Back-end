const { User } = require('./user.model');
const mongoose = require('mongoose');



let Worker = User.discriminator('worker', new mongoose.Schema({
    name: {
        type: String
    },
    surname1: {
        type: String
    },
    surname2: {
        type: String
    },
    age: {
        type: String
    },
    DNI: {
        type: String
    },
    contactData: {
        type: String
    },
    skills: {
        type: String
    }
}))

module.exports = Worker;
