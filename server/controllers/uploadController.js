
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const { User } = require('../models/user');

exports.modifyImg = async (req, res) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let type = req.params.type;
    let id = req.params.id;
    
    console.log(req.file.originalname);

    // Valida si se ha introducido algún archivo.

    if (!req.file) {
        return res.status(400)
                  .json({
                    ok: false,
                    error: {
                        message: 'There are no files in the request'
                    }
        })
    }

    // Se valida si el tipo introducido en el PATH es válido.

    if (type !== 'user') {
        return res.status(400)
                    .json({
                        ok: false,
                        error: {
                            message: 'The valid type of the request is user'
                        }
                    })
    }
    console.log(req.file);
    let file = req.file.originalname;
    let fileCut = file.split('.');
    let fileExtension = fileCut[fileCut.length - 1];
    
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    // Se valida si la extensión del archivo es válida.

        if (!validExtensions.some((ext) => ext == fileExtension)) {
            return res.status(400)
                        .json({
                            ok: false,
                            error: {
                                message: 'The valid types of file are: ' + validExtensions.join(', ')
                            }
                        })
            }
        
        // Se crea el folder.

        if (!fs.existsSync(path.resolve(__dirname, `../../uploads/${type}`))) {
    
            fs.mkdirSync(path.resolve(__dirname, `../../uploads/${type}`));
        }
        
        if (!fs.existsSync(path.resolve(__dirname, `../../uploads/${type}/${id}`))) {
    
            fs.mkdirSync(path.resolve(__dirname, `../../uploads/${type}/${id}`));
        }

        // Cambia nombre del archivo.

        req.file.filename = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

        // Mueve el archivo a la ubicación seleccionada


    userImg(id, res, type, req.file.filename);
}

exports.getImg = async(req, res) => {

    let name = req.params.name;
    
    let type = req.params.type;
    let id = req.params.id;

    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${ id }/${ name }`);
    
    if (fs.existsSync(pathFile)) {

        res.sendFile(pathFile)

    } else {

        let nofile = path.resolve(__dirname, `../assets/no_available.jpg`)
        res.sendFile(nofile)

    }
}

exports.deleteImg = async (req, res) => {

    let name = req.params.name;
    
    let type = req.params.type;
    let id = req.params.id;

    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${ id }/${ name }`);
    
    if (fs.existsSync(pathFile)) {

        try {

            let user = await User.findById(id);

            if(!user) {
                return res.status(400)
                          .json({
                              ok: false,
                              err: {
                                  message: 'This user doesn\'t exist'
                            }
                        })
                }

            deleteFile(id, type, user.img);
            deleteFolder(id, type);
            user.img = undefined;

            await user.save();

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
                                error
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


async function userImg(id, res, type, fileName) {

    try {

        let user = await User.findById(id);
        if(!user) {
    
            deleteFolder(id, type);
            return res.status(400)
                      .json({
                          ok: false,
                          err: {
                              message: 'This user doesn\'t exist'
                          }
                      })
        }

        deleteFile(id, type, UserDB.img);

        user.img = fileName;

        await user.save();

        return res.json({
            ok: true,
            user
        })

    } catch(error) {

        if(error) {
    
            deleteFolder(id, type);
            return res.status(500)
                      .json({
                            ok: false,
                            error
                        })
            }

    }
}

function deleteFile(id, type, fileName) {

    let filePath = path.resolve(__dirname, `../../uploads/${type}/${id}/${fileName}`)
    
    if(fs.existsSync(filePath)) {

        fs.unlinkSync(filePath)

    }
}

function deleteFolder(id, type) {
        
    let filePath = path.resolve(__dirname, `../../uploads/${type}/${id}`)
        
    if(fs.existsSync(filePath)) {
            fs.rmdirSync(filePath, {recursive: true})
    }
}