const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'RECRUITER_ROLE', 'WORKER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({

    creationDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Enter the email is mandatory']
    },
    password: {
        type: String,
        required: [true, 'Enter a password is mandatory']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, 'Role should be ADMIN_ROLE or RECRUITER_ROLE'],
        default: 'WORKER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    recruiterData: {
        type: Schema.Types.ObjectId, 
        ref: 'Recruiter',
        autopopulate: true
    },
    workerData: {
        type: Schema.Types.ObjectId, 
        ref: 'Worker',
        autopopulate: true
    },


});

// Para eliminar el password cuando se envíen datos.

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin( uniqueValidator, { message: '{PATH} should be unique' } )
userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('User', userSchema);