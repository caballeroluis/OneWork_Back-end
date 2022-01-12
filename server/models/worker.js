const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let workerSchema = new Schema({

    name: {
        type: String,
        
    },
    surname1: {

    },
    surname2: {

    },
    age: {

    },
    sex: {

    },
    CV: {

    },
    offersApplied: [{
        type: Schema.Types.ObjectId, 
        ref: 'Offer',
    }]
})

module.exports = mongoose.model('Worker', workerSchema);