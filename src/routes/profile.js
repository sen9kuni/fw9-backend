const profile = require('express').Router();

const profileControllers = require('../controllers/profile');

const { body } = require('express-validator');

// var validator
const createProfileValidator = [
  body('fullname').isLength({min: 7}).withMessage('Fullname length minimal 7'),
  body('phonenumber').isLength({min: 12}).withMessage('Phone number length minimal 12')
];

// const editProfileValidator = [
//   body('fullname').isLength({min: 7}).withMessage('Fullname length minimal 7'),
//   body('phonenumber').isLength({min: 12}).withMessage('Phone number length minimal 12')
// ];
// end var validator

profile.get('/', body('limit').toInt(), body('page').toInt(), profileControllers.searchSortProfile);
profile.get('/:id', profileControllers.getProfileById);
profile.post('/', ...createProfileValidator, profileControllers.createProfile);

// base
// profile.patch('/:id', ...editProfileValidator, profileControllers.editProfile);

// experiment
profile.patch('/:id', profileControllers.editProfile);
// experiment

profile.delete('/:id', profileControllers.deleteProfile);

module.exports = profile;