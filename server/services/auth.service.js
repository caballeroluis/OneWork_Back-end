const bcryptjs = require('bcryptjs');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user.model');
const refreshTokenModel = require('../models/refreshToken.model');

let userLogin = async function(email, password) {

    try {   
        let user = await User.findOne({ email })
                             .where({active: true});
        if (!user) throw {status: 400, message: 'Password or user is incorrect'};

        const correctPassword = await bcryptjs.compare(password, user.password);
        if(!correctPassword) throw {status: 400, message: 'Password or user is incorrect'};
        
        let refreshTokenDBExists = await refreshTokenModel.findOne(user._id);

        user = _.pick(user, ['_id', 'img', 'email', 'role', 'name', 'offers']);

        //TODO: hay que registrar los secret de forma diferente con archivo .env
        let token = jwt.sign(user, process.env.SECRET, {expiresIn: 300});
        let refreshToken = jwt.sign({}, process.env.SECRET, {expiresIn: '4d'});

        if(refreshTokenDBExists) {
            refreshTokenDBExists.token = refreshToken;
            await refreshTokenDBExists.save();
        } else {
            let refreshTokenToSave = new refreshTokenModel({
                user: user._id,
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
        
        if(refreshTokenExists && jwt.verify(refreshToken, process.env.SECRET)) {
            let user = await User.findOne(refreshTokenExists.user)
                                 .where({active: true});
            if (!user) throw {status: 400, message: 'User doesn\'t exist'};

            user = _.pick(user, ['_id', 'img', 'email', 'role', 'name', 'offers']);

            let newToken = jwt.sign(user, process.env.SECRET, {expiresIn: 1500});
            return newToken;
        } else {
            throw {status: 403, message: 'RefreshToken has been expired, please login again'}
        }
    } catch(error) {
        throw error;
    }
}

let userLogout = async function(id) {
    try {      
        let refreshToken = await refreshTokenModel.findOne({user: id});
        if (!refreshToken) throw {status: 403, message: 'This refreshToken doesn\'t exist'};
        refreshToken.token = undefined;
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