const jwt = require('jsonwebtoken');


let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');  
    try{
        token = token.split(' ')[1];
    } catch(error) {
        return res.status(400).json({message: 'The token is not provided or is invalid'});
    }
    
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) return res.status(401).json({error});
        req.user = decoded;
        next();

    });
};


module.exports = verifyToken;