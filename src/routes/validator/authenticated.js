const { body } = require('express-validator')
const bcrypt = require('bcrypt')

exports.addphone = [body('phonenumber').isLength({ min: 12 }).withMessage('Phone number length minimal 12')]

exports.changePassword = [
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password length minimal 8 character')
    .customSanitizer(async (val) => {
      const hash = await bcrypt.hash(val, 10)
      return hash
    })
]

exports.changePin = [
  body('pin')
    .isNumeric()
    .withMessage('pin must number')
    .isLength({ min: 6, max: 6 })
    .withMessage('Pin length must be 6')
]

exports.editPhone = [body('phonenumber').isLength({ min: 12 }).withMessage('Phone number length minimal 12')]

exports.transfer = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must number')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Wrong input amount')
]
