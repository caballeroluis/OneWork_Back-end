const { deleteFolder, deleteFile } = require('../utils/filesUtil');
const { User } = require('../models/user');


let modifyImg = async function(req) {

    const fileName = req.file.filename;
    const { id, type } = req.params;

    try {
        let user = await User.findById(id);
        if(!user) throw {status: 400, message: 'This user doesn\'t exist'};
        deleteFile(id, type, user.img);

        user.img = fileName;

        await user.save();
        
        return user;
    } catch(error) {
        deleteFolder(id, type);
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}

let getImg = async function(id) {

    try {
        let user = await User.findById(id);
        if(!user) throw {status: 400, message: 'This user doesn\'t exist'};

        return user.img;
    } catch(error) {
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}

let deleteImg = async function(id) {

    try {
        let user = await User.findById(id);
        if(!user) throw {status: 400, message: 'This user doesn\'t exist'};

        deleteFile(id, 'users', user.img);
        deleteFolder(id, 'users');
        user.img = undefined;

        await user.save();

        return user;
    } catch(error) {
        if(!error.status) {
            throw {status: 500, message: 'Internal server error'};
        } else {
            throw error;
        } 
    }
}

module.exports = {
    modifyImg,
    getImg,
    deleteImg
}