const { validationResult } = require('express-validator')
const response = require('../helpers/standardRespond')

const profileValidation = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return response(res, 'Validation error', error.array(), null, 400)
  }
  next()
}

module.exports = profileValidation
