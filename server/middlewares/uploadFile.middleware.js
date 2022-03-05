const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { ValidationDataError } = require('../utils/customErrors.util');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, file.path);
    }, 
    filename: function (req, file, cb) {
        cb(null, file.name);
    }
});

let fileFilter = function (req, file, cb) {

    const { id } = req.params;

    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    let fileMimeExtension = file.mimetype.split('/')[1];

    let extensionSplitted = file.originalname.split('.');
    let extension = extensionSplitted[extensionSplitted.length - 1];

    file.extension = extension;   
    if (!(validExtensions.includes(fileMimeExtension)) && !(validExtensions.includes(extension))) {
        return cb(new ValidationDataError('Only png, jpg, gif and jpeg extensions are allowed', false)) 
    } else {

        if (!fs.existsSync(path.resolve(__dirname, `../../uploads/users`))) {
            fs.mkdirSync(path.resolve(__dirname, `../../uploads/users`));
        }
        if (!fs.existsSync(path.resolve(__dirname, `../../uploads/users/${id}`))) {
            fs.mkdirSync(path.resolve(__dirname, `../../uploads/users/${id}`));
        }

        file.path = path.resolve(__dirname, `../../uploads/users/${id}`);
        file.name = `${req.params.id}-${new Date().getMilliseconds()}.${file.extension}`;

        cb(null, true);
    }
};

let uploadHandler = async function(req, res, next) {
    // TODO: determinar la cantidad máxima de bytes de los archivos.
    multer({storage: storage, fileFilter: fileFilter, limits: { fileSize: 1048576 }}).single('image')(req, res, function(error){
        if (error) return next(error);
        if (!req.file) return next(new ValidationDataError('There is not a file in the request'));
        next();
    })
}

module.exports = uploadHandler;