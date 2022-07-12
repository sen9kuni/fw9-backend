const {body} =require('express-validator');

const profileValidatorRules = [
  body('fullname').isLength({min: 7}).withMessage('Fullname length minimal 7'),
  body('balance').toInt().isNumeric().withMessage('Balance must be umber'),
  body('phonenumber').isLength({min: 12}).withMessage('Phone number length minimal 12')
];

module.exports = profileValidatorRules;