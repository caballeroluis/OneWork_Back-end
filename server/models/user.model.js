const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let options = {collection: 'users', discriminatorKey: 'role'};

let userSchema = new mongoose.Schema({

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
    active: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    offers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'offer'
    }]
}, options)

// Para eliminar el password cuando se envíen datos.
    
userSchema.methods.toJSON = function() {
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
}

userSchema.statics.findByIdAndUpdateActivesNoShowActives = function (id, body) {
    return this.findByIdAndUpdate(id, body, {new: true, runValidators: true})
               .where({active: true})
               .select('-active')
}

userSchema.statics.findByIdActivesNoShowActives = function (id) {
    return this.findById(id)
               .where({active: true})
               .select('-active')
}

userSchema.statics.findByIdActivesShowActives = function (id) {
    return this.findById(id)
               .where({active: true})
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

let User = mongoose.model('user', userSchema);
let Admin = User.discriminator('admin', new mongoose.Schema({}));
    
module.exports = {
    User,
    Admin
};