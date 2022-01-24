const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let options = {collection: 'users', discriminatorKey: '_type'};

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
    state: {
        type: Boolean,
        default: true
    },
    offers: [{
        type: Schema.Types.ObjectId, 
        ref: 'Offer',
        autopopulate: true
    }]
}, options)

// Para eliminar el password cuando se envíen datos.
    
userSchema.methods.toJSON = function() {
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
}
    
userSchema.plugin(require('mongoose-autopopulate'));

let User = mongoose.model('User', userSchema);

let Recruiter = User.discriminator('Recruiter', new mongoose.Schema({
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

let Worker = User.discriminator('Worker', new mongoose.Schema({
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
        
    }})
)

let Admin = User.discriminator('Admin', new mongoose.Schema({}));
    
module.exports = {
    User,
    Admin,
    Worker,
    Recruiter
};