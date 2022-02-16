const { User } = require('./user.model');
const mongoose = require('mongoose');

let validStatus = {
    // TODO: se ha hecho prueba técnica, se ha hablado con el equipo técnico, salario concretado
    values: ['male', 'female', 'undefined'],
    message: '{VALUE} is not a valid sex'
}

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
    sex: {
        type: String,
        enum: validStatus,
        default: 'undefined'
    },
    age: {
        type: String
    },
    DNI: {
        type: String
    },
    contactData: {
        type: String
    }})
)

module.exports = Worker;
