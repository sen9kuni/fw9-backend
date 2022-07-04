const users = require('express').Router();

const userControllers = require('../controllers/users');

const { body } = require('express-validator');

const bcrypt = require('bcrypt');


// var validator
const createUserValidator = [
  body('email')
    .isEmail().withMessage('Email format invalid'),
  body('username')
    .isLength({min: 4}).withMessage('Username length minimal 4 character'),
  body('password')
    .isLength({min: 8}).withMessage('Password length minimal 8 character')
    .customSanitizer(async (val) =>{
      const hash = await bcrypt.hash(val, 10);
      return hash;
    })
];

const editUserValidator = [
  body('email').isEmail().withMessage('Email format invalid'),
  body('username').isLength({min: 4}).withMessage('Username length minimal 4 character'),
  body('password')
    .isLength({min: 8}).withMessage('Password length minimal 8 character')
    .customSanitizer(async (val) =>{
      const hash = await bcrypt.hash(val, 10);
      return hash;
    })
];
// end var validator

// users.get('/', userControllers.getAllUsers);
users.get('/', body('table_name'), body('limit').toInt(), body('page').toInt(), userControllers.searchSortUsers);
users.get('/:id',userControllers.searchUserById);
users.post('/', ...createUserValidator, userControllers.createUser);
users.patch('/:id', ...editUserValidator, userControllers.editUser);
users.delete('/:id', userControllers.deleteUser);

module.exports = users;