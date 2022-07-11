const auth = require('express').Router();

const authController = require('../controllers/auth');
const rule = require('./validator/auth');
const validator = require('../middleware/validation');

// base
// auth.post('/register', rule.register, validator, authController.register);

// experiment
auth.post('/register', rule.register, validator, authController.register2);

auth.post('/createPin', rule.createPin, validator, authController.createPin);
auth.post('/login', rule.login, validator, authController.login);

module.exports = auth;