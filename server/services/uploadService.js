const { deleteFolder, deleteFile } = require('../utils/filesUtil');
const { User } = require('../models/user');


let modifyImg = async function(req) {

    const fileName = req.file.filename;
    const { id, type } = req.params;

    try {
        let user = await User.findById(id);

        deleteFile(id, type, user.img);

        user.img = fileName;

        await user.save();
        
        return user;
        
    } catch(error) {
        deleteFolder(id, type);
        console.log(error);
        return error;
    }
}

let deleteImg = async function(req) {

    const { id, type } = req.params;

    try {
        
        let user = await User.findById(id);

        deleteFile(id, type, user.img);
        deleteFolder(id, type);
        user.img = undefined;

        await user.save();
        return user;
    } catch(error) {
        return error
    }
}

module.exports = {
    modifyImg,
    deleteImg
}