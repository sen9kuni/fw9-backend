const users = require('express').Router();

const userControllers = require('../controllers/users');

const { body } = require('express-validator');

const createUserValidator = [
  body('email').isEmail().withMessage('Email format invalid'),
  body('username').isLength({min: 4}).withMessage('Username length minimal 4 character')
];

users.get('/', userControllers.getAllUsers);
users.get('/:id',userControllers.searchUserById);
users.post('/', ...createUserValidator, userControllers.createUser);
users.patch('/:id', userControllers.editUser);
users.delete('/:id', userControllers.deleteUser);


// users.post('/', userControllers.postAllUsers);
// users.put('/', userControllers.putAllUsers);
// users.delete('/', userControllers.deleteAllUsers);

// users.get('/:id', (req, res) => {
//   const id = req.params.id;
//   if (Number(id) === 1) {
//     const user = {
//       id: 1,
//       username: 'prayogo santoso',
//       email: 'blabla@gmail.com',
//       phoneNumber: '0895552826'
//     };
//     res.send(user);
//   } else {
//     const user = {
//       id: 2,
//       username: 'sasa',
//       email: 'blabla@gmail.com',
//       phoneNumber: '0895552826'
//     };
//     res.send(user);
//   }
// });

module.exports = users;