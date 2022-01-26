
const fs = require('fs');
const path = require('path');

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

module.exports = {
    deleteFile,
    deleteFolder
}