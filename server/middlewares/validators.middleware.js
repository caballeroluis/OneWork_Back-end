const { check } = require('express-validator');
const { DNIValidator } = require('../utils/validators.util');

exports.userValidator = [
    check('email', 'Enter a valid email').isEmail().trim().escape(),
    check('password', 'Password must be a minimum of 6 characters').isLength({
        min: 8,
    }).trim().escape(),
    check('age', 'Enter a number').optional().isNumeric(),
    check('DNI', 'Please check the DNI or NIE introduced').optional().trim().custom(DNIValidator)   
]

exports.offerValidator = [
    
]