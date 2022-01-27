const multer = require('multer');
const fs = require('fs');
const path = require('path');

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
    let extension = extensionSplitted[extensionSplitted.length - 1]

    file.extension = extension;   
    if (!(validExtensions.includes(fileMimeExtension)) && !(validExtensions.includes(extension))) {
        return cb(new Error('Only png, jpg, gif and jpeg extensions are allowed', false)) 
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
    multer({storage: storage, fileFilter: fileFilter}).single('image')(req, res, function(error){
        if (error) {
            return res.status(500)
                      .json({
                        ok: false,
                        message: error.message

                      })
        } else if (!req.file) {

            return res.status(400)
                      .json({
                        ok: false,
                        message: 'There is not a file in the request'
    
                    })
        } else if (error instanceof multer.MulterError) {
            return res.status(400)
                      .json({
                            ok: false,
                            message: 'No more than XMB files is allowed'
            })
        } else {
            next()
        } 
    })
}

module.exports = uploadHandler;