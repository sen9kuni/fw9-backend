const authenticated = require('express').Router();
const authMiddelware = require('../middleware/auth');
const authenticatedController = require('../controllers/authenticated');
const uploadProfile = require('../middleware/uploadProfile');
const profileValidatorRules = require('./validator/validatorProfile');
const rule = require('./validator/authenticated');

// GET
authenticated.get('/profile', authMiddelware, authenticatedController.profile);
// not work yet
authenticated.get('/historyTransactions', authMiddelware, authenticatedController.historyTransactions);
// not work yet

// POST
authenticated.post('/phone', authMiddelware, authenticatedController.addPhone);
authenticated.post('/transfer', authMiddelware, rule.transfer, authenticatedController.transfer);
authenticated.post('/topup', authMiddelware, rule.transfer, authenticatedController.topUp);

// PATCH
authenticated.patch('/profile', authMiddelware, uploadProfile, ...profileValidatorRules, authenticatedController.updateProfile);
authenticated.patch('/changePassword', authMiddelware, rule.changePassword, authenticatedController.changePasswordTest);
authenticated.patch('/changePin', authMiddelware, rule.changePin, authenticatedController.editPin);
authenticated.patch('/phone', authMiddelware, rule.editPhone, authenticatedController.editPhonenumber);

module.exports = authenticated;