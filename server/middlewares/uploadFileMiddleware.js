const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const { type, id } = req.params;

        if (!fs.existsSync(path.resolve(__dirname, `../../uploads/${type}`))) {
        
            fs.mkdirSync(path.resolve(__dirname, `../../uploads/${type}`));
        }
        
        if (!fs.existsSync(path.resolve(__dirname, `../../uploads/${type}/${id}`))) {
    
            fs.mkdirSync(path.resolve(__dirname, `../../uploads/${type}/${id}`));
        }

        cb(null, `./uploads/${type}/${id}`);
    }, 
    filename: function (req, file, cb) {
        cb(null, `${req.params.id}-${new Date().getMilliseconds()}.${file.fileExtension}`);
    }
});

let fileFilter = function (req, file, cb) {

    const { type } = req.params;
    
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    let fileExtension = file.mimetype.split('/')[1];
    file.fileExtension = fileExtension;   

    let validTypes = 'user';
    
    if (!(validExtensions.includes(fileExtension))) {
        return cb(new Error('Only png, jpg, gif and jpeg extensions are allowed', false)) 
    } else if( type !== validTypes ) {
        return cb(new Error('Only user type is allowed', false))
    } else {
        cb(null, true)
    }
};

let uploadHandler = async function(req, res, next) {
    multer({storage: storage, fileFilter: fileFilter}).single('image')(req, res, function(error){
        if(!req.file) {
            return res.status(400)
                  .json({
                        ok: false,
                        err: {
                            message: 'There is not a file in the request'
                        }
                    })
        }

        if(error) {
            return res.status(500)
                      .json({
                          ok: false,
                          error: {
                              message: error.message
                          }
                      })
        } else if (error instanceof multer.MulterError) {
            return res.status(400)
                      .json({
                            ok: false,
                            error: {
                            message: 'No more than XMB files is allowed'
                        }
            })
        } else {
            next()
        } 
    })
};


module.exports = uploadHandler;