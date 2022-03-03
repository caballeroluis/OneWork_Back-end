const { check } = require('express-validator');
const { DNIValidator } = require('../utils/validators.util');

// Establecer diferentes validadores
exports.userValidator = [
    check('email', 'Enter a valid email').optional().isEmail().trim().escape(),
    check('password', 'Password must be a minimum of 6 characters').optional().isLength({
        min: 8,
    }).trim().escape(),
    check('age', 'Enter a number').optional().isNumeric(),
    check('DNI', 'Please check the DNI or NIE introduced').optional().trim().escape().custom(DNIValidator),
    check('name', 'Enter a name').optional(),
    check('surname', 'Enter a surname').optional(),
    check('surname1', 'Enter a surname 2').optional()

]

exports.offerValidator = [
    

]