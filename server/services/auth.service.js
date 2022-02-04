const bcryptjs = require('bcryptjs');
const { User } = require('../models/user.model')
const _ = require('underscore');

let userLogin = async function(email, password) {

    try {   
        let user = await User.findOne({ email })
                             .where({active: true});
        if (!user) throw {status: 400, message: 'Password or user is incorrect'};

        const correctPassword = await bcryptjs.compare(password, user.password);
        
        if(!correctPassword) throw {status: 400, message: 'Password or user is incorrect'};

        user = _.pick(user, ['_id', 'img', 'email', 'role', 'name', 'offers']);

        return user;
    } catch(error) {
        throw error;
    }
}

let userLogout = async function(token, refreshToken) {

    try {   
        let user = await User.findOne({ email });
        if (!user) throw {status: 400, message: 'Password or user is incorrect'};

        const correctPassword = await bcryptjs.compare(password, user.password);
        
        if(!correctPassword) throw {status: 400, message: 'Password or user is incorrect'};
  
        user = _.pick(user, ['_id', 'img', 'email', '_type', 'name', 'recruiterName']);

        return user;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    userLogin,
    userLogout
}