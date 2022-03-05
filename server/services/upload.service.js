const { deleteFolder, deleteFile } = require('../utils/files.util');
const { User } = require('../models/user.model');
const { ErrorBDEntityNotFound } = require('../utils/customErrors.util')

let modifyImg = async function(fileName, id, type) {

    try {
        let user = await User.findById(id)
                             .where({active: true});
        if(!user) throw new ErrorBDEntityNotFound('This user doesn\'t exist');
        
        deleteFile(id, type, user.img);

        user.img = fileName;

        await user.save();
        
        return user;
    } catch(error) {
        deleteFolder(id, type);
        throw error
    }
}

let getImg = async function(id) {
    try {
        let user = await User.findById(id)
                             .where({active: true});
        if(!user) throw new ErrorBDEntityNotFound('This user doesn\'t exist');

        return user.img;
    } catch(error) {
        throw error;
    }
}

let deleteImg = async function(id) {
    try {
        let user = await User.findById(id)
                             .where({active: true});
        if(!user) throw new ErrorBDEntityNotFound('This user doesn\'t exist');

        deleteFile(id, 'users', user.img);
        deleteFolder(id, 'users');
        user.img = undefined;

        await user.save();

        return user;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    modifyImg,
    getImg,
    deleteImg
}