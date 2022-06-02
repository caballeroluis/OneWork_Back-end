const { check } = require('express-validator');
const { DNIValidator, dateBeforePresentValidator } = require('../utils/validators.util');

// TODO: Establecer diferentes validadores
exports.userValidator = [
    check('email', 'Enter a valid username').optional().trim().escape(),
    check('password', 'Password must be a minimum of 8 characters').optional().isLength({
        min: 8,
        max: 20
    }).contains().trim().escape(),
    check('age', 'Enter a number').optional().isNumeric().escape(),
    check('DNI', 'Please check the DNI or NIE introduced').optional().trim().escape().custom(DNIValidator),
    check('name', 'Enter a pseudonym').isAlpha().trim().escape(),

]

exports.sessionValidator = [
    check('email', 'Enter a valid username').optional().trim().escape(),
    check('password', 'Password must be a minimum of 8 characters').optional().isLength({
        min: 8,
        max: 20
    }).trim().escape()
]

exports.offerValidator = [
    check('salary', 'Enter a number').isNumeric().escape(),
    check('requirements', 'Enter a valid requirements string').isString().escape(),
    check('workplaceAddress', 'Enter a valid address').optional().escape(),
    check('description', 'Enter a valid description').optional().escape(),
    check('workplaceAddress', 'Enter a valid address').optional().isLength({
        max: 50
    }).escape(),
    check('videoCallDate').optional()
                          .trim()
                          .isISO8601()
                          .withMessage('Enter a correct date')
                          .custom(dateBeforePresentValidator)
                          .withMessage('Must be a value after actual date'),
    check('videoCallLink', 'Enter a correct google meets link').optional().trim(),
    check('technicianChecked', 'Enter true or false').optional().isBoolean().escape()    
]

exports.offerModifyValidator = [
    check('salary', 'Enter a number').optional().isNumeric().escape(),
    check('requirements', 'Enter a valid requirements string').optional().isString().escape(),
    check('workplaceAddress', 'Enter a valid address').optional().escape(),
    check('description', 'Enter a valid description').optional().escape(),
    check('workplaceAddress', 'Enter a valid address').optional().isLength({
        max: 50
    }).escape(),
    check('videoCallDate').optional()
                          .trim()
                          .isISO8601()
                          .withMessage('Enter a correct date')
                          .custom(dateBeforePresentValidator)
                          .withMessage('Must be a value after actual date'),
    check('videoCallLink', 'Enter a correct google meets link').optional().trim(),
    check('technicianChecked', 'Enter true or false').optional().isBoolean().escape()
]