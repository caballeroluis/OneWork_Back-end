const { validationResult } = require('express-validator');
const uploadService = require('../services/upload.service');
const { responseOkElementCreated, responseOk, 
        responseOkArray, responseOkElementDeleted } = require('../utils/customResponses.util');

const fs = require('fs');
const path = require('path');

exports.modifyImg = async (req, res, next) => {
    const fileName = req.file.filename;
    const { id, type } = req.params;
    try {
        let user = await uploadService.modifyImg(fileName, id, type);
        responseOk(res, user);
    } catch(error) {
        next(error);
    }
}


exports.getImg = async (req, res, next) => {

    let id = req.params.id;

    try {

        let img = await uploadService.getImg(id);
        let pathFile = path.resolve(__dirname, `../../uploads/users/${ id }/${ img }`);
        if (fs.existsSync(pathFile) && img) {
            res.sendFile(pathFile);
        } else {
            let nofile = path.resolve(__dirname, `../assets/no_available.jpg`)
            res.sendFile(nofile);
        }
    } catch(error) {
        next(error);
    }
}

exports.deleteImg = async (req, res, next) => {
    let id = req.params.id;
    try {
        await uploadService.deleteImg(id);
        responseOkElementDeleted(res);
    } catch(error) {
        next(error);
    }
}

