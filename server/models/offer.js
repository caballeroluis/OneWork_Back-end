const mongoose = require('mongoose');

let validStatus = {
    values: ['Opened', 'Uncompleted', 'Videoconference set', 'Accepted'],
    message: '{VALUE} is not a valid status'
}

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
        default: 'Opened',
        enum: validStatus
    }

})

let Schema = mongoose.Schema;


module.exports = mongoose.model('Offer', offerSchema);