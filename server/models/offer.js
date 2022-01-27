const mongoose = require('mongoose');

let validStatus = {
    // TODO: se ha hecho prueba técnica, se ha hablado con el equipo técnico, salario concretado
    values: ['created', 'completed', 'videoconferenceSet', 'accepted', 'eliminated'],
    message: '{VALUE} is not a valid status'
}

let Schema = mongoose.Schema;

let offerSchema = new Schema({

    creationDate: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number,
        required: [true, 'Enter salary is mandatory']
    },
    title: {
        type: String,
        required: [true, 'Enter job title is mandatory']
    },
    requirements: {
        type: String,
        required: [true, 'Enter work requirments']
    },
    workplaceAdress: {
        type: String,
        required: [true, 'Enter workplace is mandatory']
    },
    description: {
        type: String,
        required: [true, 'Enter a brief description of this job']
    },
    status: {
        type: String,
        default: 'created',
        enum: validStatus
    }
})

module.exports = mongoose.model('Offer', offerSchema);