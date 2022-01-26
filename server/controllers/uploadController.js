const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const fs = require('fs');
const path = require('path');

exports.modifyImg = async (req, res, next) => {

    try {
        let user = await userService.modifyImg(req);

        return res.json({
            ok: true,
            user
        })

    } catch(error) {
        next(error)
    }
}


exports.getImg = async(req, res) => {

    let name = req.params.name;
    let type = req.params.type;
    let id = req.params.id;

    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${ id }/${ name }`);
    
    if (fs.existsSync(pathFile)) {
        res.sendFile(pathFile);
    } else {
        let nofile = path.resolve(__dirname, `../assets/no_available.jpg`)
        res.sendFile(nofile);
    }
}

exports.deleteImg = async (req, res) => {

    let name = req.params.name;
    let type = req.params.type;
    let id = req.params.id;

    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${ id }/${ name }`);
    
    if (fs.existsSync(pathFile)) {

        try {
            let user = await userService.deleteImg(req)

            res.json({
                ok: true,
                user,
                message: 'The photo was successfully deleted'
            })

        } catch(error) {
            if(error) {
                return res.status(500)
                          .json({
                                ok: false,
                                error: error.message
                            })
            }
        }
    } else {
        return res.json({
            ok: true,
            message: 'The photo was successfully deleted'
        })
    }
}

