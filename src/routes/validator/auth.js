const { body } = require('express-validator')
const bcrypt = require('bcrypt')

exports.register = [
  body('email').isEmail().withMessage('Email format invalid'),
  // body('username')
  //   .isLength({min: 4}).trim().withMessage('Username length minimal 4 character')
  //   .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the username'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password length minimal 8 character')
    .customSanitizer(async (val) => {
      const hash = await bcrypt.hash(val, 10)
      return hash
    })
]

exports.resetPassword = [
  body('email').isEmail().withMessage('Email format invalid'),
  // body('username')
  //   .isLength({min: 4}).trim().withMessage('Username length minimal 4 character')
  //   .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the username'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password length minimal 8 character')
    .customSanitizer(async (val) => {
      const hash = await bcrypt.hash(val, 10)
      return hash
    })
]

exports.createPin = [
  body('email').isEmail().withMessage('Email format invalid'),
  body('pin')
    .isLength({ min: 6, max: 6 })
    .withMessage('Pin length must be 6')
    .isNumeric()
    .withMessage('pin must number')
]

exports.login = [body('email').isEmail().withMessage('Email format invalid')]
