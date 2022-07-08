const auth = require('express').Router();

const authController = require('../controllers/auth');
const rule = require('./validator/auth');
const validator = require('../middleware/validation');

auth.post('/register', rule.register, validator, authController.register);
auth.post('/createPin', rule.createPin, validator, authController.createPin);
auth.post('/login', rule.login, validator, authController.login);

module.exports = auth;