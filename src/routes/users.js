const users = require('express').Router()

const userControllers = require('../controllers/users')

const { body } = require('express-validator')

const bcrypt = require('bcrypt')

// var validator
const createUserValidator = [
  body('email').isEmail().withMessage('Email format invalid'),
  body('pin').isNumeric().withMessage('pin must number'),
  body('pin').isLength({ min: 6, max: 6 }).withMessage('Pin length must be 6'),
  body('username').isLength({ min: 4 }).trim().withMessage('Username length minimal 4 character'),
  body('username')
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password length minimal 8 character')
    .customSanitizer(async (val) => {
      const hash = await bcrypt.hash(val, 10)
      return hash
    })
]

const editUserValidator = [
  body('email').isEmail().withMessage('Email format invalid'),
  body('pin').isNumeric().withMessage('pin must number'),
  body('pin').isLength({ min: 6, max: 6 }).withMessage('Pin length must be 6'),
  body('username').isLength({ min: 4 }).trim().withMessage('Username length minimal 4 character'),
  body('username')
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password length minimal 8 character')
    .customSanitizer(async (val) => {
      const hash = await bcrypt.hash(val, 10)
      return hash
    })
]
// end var validator

users.get('/', body('limit').toInt(), body('page').toInt(), userControllers.searchSortUsers)
users.get('/:id', userControllers.getUserById)
users.post('/', ...createUserValidator, userControllers.createUser)
users.patch('/:id', ...editUserValidator, userControllers.editUser)
users.delete('/:id', userControllers.deleteUser)

module.exports = users
