const auth = require('express').Router()
// const authMiddelware = require('../middleware/auth');
const authController = require('../controllers/auth')
const rule = require('./validator/auth')
const validator = require('../middleware/validation')

// base
// auth.post('/register', rule.register, validator, authController.register);

// experiment
auth.post('/register', rule.register, validator, authController.register2)
auth.post('/registerNew', rule.register, validator, authController.register3)
auth.post('/resetPassword', rule.resetPassword, validator, authController.resetPassword)

auth.post('/setTokenNotif', authController.createTokenNotif)
auth.post('/createPin', rule.createPin, validator, authController.createPin)
auth.post('/login', rule.login, validator, authController.login)
auth.patch('/removeUserFromToken', authController.removeUserFromToken)

module.exports = auth
