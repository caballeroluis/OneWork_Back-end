const bcryptjs = require('bcryptjs');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const { ErrorPwdOrUserNotFound, ErrorBDEntityNotFound, UnathorizedError } = require('../utils/customErrors.util');
const config = require('../config/env.config');
const { User } = require('../models/user.model');
const refreshTokenModel = require('../models/refreshToken.model');

let userLogin = async function(email, password) {
    try {  
        let user = await User.findOne({ email })
                             .where({active: true})
                             .select('-active -offers');
        if (!user) throw new ErrorPwdOrUserNotFound('Password or user is incorrect');

        const correctPassword = await bcryptjs.compare(password, user.password);
        if(!correctPassword) throw new ErrorPwdOrUserNotFound('Password or user is incorrect');
        
        let refreshTokenDBExists = await refreshTokenModel.findOne({user: user._id});

        let payload = _.pick(user, ['_id', 'img', 'email', 'role', 'name', 'recruiterName', 'corporationName', 'international']);

        let token = jwt.sign(payload, config.SECRET, {expiresIn: 300});
        let refreshToken = jwt.sign({}, config.SECRET_REFRESH, {expiresIn: '4d'});

        if(refreshTokenDBExists) {
            refreshTokenDBExists.token = refreshToken;
            await refreshTokenDBExists.save();
        } else {
            let refreshTokenToSave = new refreshTokenModel({
                user: payload._id,
                token: refreshToken
            })
            await refreshTokenToSave.save();
        }
        return { token, refreshToken, user };
    } catch(error) {
        throw error;
    }
}

let letsRefreshToken = async function(refreshToken) {
    try {      
        let refreshTokenExists = await refreshTokenModel.findOne({token: refreshToken});
        if(refreshTokenExists && jwt.verify(refreshToken, config.SECRET_REFRESH)) {
            let user = await User.findById(refreshTokenExists.user)
                                 .where({active: true})
                                 .select('-active -offers');
            if (!user) throw new ErrorBDEntityNotFound('User doesn\'t exist');
            let payload = _.pick(user, ['_id', 'img', 'email', 'role', 'name', 'recruiterName', 'corporationName', 'international']);

            let newToken = jwt.sign(payload, config.SECRET, {expiresIn: 1500});
            return newToken;
        } else {
            throw new UnathorizedError('RefreshToken has been expired or doesn\'t exist');
        }
    } catch(error) {
        throw error;
    }
}

let userLogout = async function(id) {
    try {      
        let refreshToken = await refreshTokenModel.findOne({user: id});
        if (!refreshToken) throw new ErrorBDEntityNotFound('This refreshToken doesn\'t exist');
        refreshToken.token = ' ';
        await refreshToken.save();
        return;
    } catch(error) {
        throw error;
    }

}

module.exports = {
    userLogin,
    letsRefreshToken,
    userLogout
}