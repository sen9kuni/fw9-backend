const response = require('./standardRespond')

const errorHandling = (msg, param, location = 'body') => [
  {
    msg,
    param,
    location
  }
]

const errorResponse = (err, res) => {
  // users
  if (err.code === '23505' && err.detail.includes('email')) {
    const errorRes = errorHandling('Email already exists', 'email')
    return response(res, 'Error', errorRes, null, 400)
  }
  if (err.code === '23505' && err.detail.includes('username')) {
    const errorRes = errorHandling('Username already exists', 'username')
    return response(res, 'Error', errorRes, null, 400)
  }
  // end users

  // profile
  if (err.code === '23505' && err.detail.includes('user_id')) {
    const errorRes = errorHandling('User id already exists', 'User Id')
    return response(res, 'Error', errorRes, null, 400)
  }
  if (err.code === '23505' && err.detail.includes('phonenumber')) {
    const errorRes = errorHandling('Phone number already exists', 'phonenumber')
    return response(res, 'Error', errorRes, null, 400)
  }
  // end profile

  // transaction type
  if (err.code === '23505' && err.detail.includes('name')) {
    const errorRes = errorHandling('Name already exists', 'name')
    return response(res, 'Error', errorRes, null, 400)
  }
  // end transaction type

  return response(res, 'Error', null, null, 400)
}

module.exports = errorResponse
