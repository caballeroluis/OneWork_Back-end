const bcryptjs = require('bcryptjs');
const { User } = require('../models/user')
const _ = require('underscore');

let userLogin = async function(req) {

    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Password or user is incorrect'
            });
        }
        
        const correctPassword = await bcryptjs.compare(password, user.password);
        
        if (!correctPassword) {
            return res.status(401).json({
                ok: false,
                message: 'Password or user is incorrect'
            });
        }
        
        user = _.pick(user, ['_id', 'img', 'email', '_type', 'name', 'recruiterName']);

        return user;
    
    } catch(error) {
        return error;
    }
}

module.exports = {
    userLogin
}