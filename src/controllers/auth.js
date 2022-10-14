const userModel = require('../models/users')
const authmodel = require('../models/authenticated')
const notifModel = require('../models/notifications')
const response = require('../helpers/standardRespond')
const errorResponse = require('../helpers/errorResponse')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('../helpers/firebaseNotif')

exports.register = (req, res) => {
  req.body.pin = null
  userModel.createUser(req.body, (err) => {
    if (err) {
      return errorResponse(err, res)
    }
    return response(res, 'Register successfully')
  })
}

exports.resetPassword = (req, res) => {
  const { email, newPassword } = req.body
  userModel.getUserByEmail(email, (err, results) => {
    if (results.rows.length > 0) {
      userModel.resetPassword(email, newPassword, (err) => {
        if (err) {
          return errorResponse(err, res)
        } else {
          return response(res, 'Change Password successfully')
        }
      })
    } else {
      return response(res, 'Error: Email does not exists', null, null, 400)
    }
  })
}

exports.createPin = (req, res) => {
  const { email } = req.body
  userModel.getUserByEmail(email, (err, results) => {
    if (results.rows.length > 0) {
      const user = results.rows[0]
      if (user.pin === null) {
        userModel.updateUser(user.id, { pin: req.body.pin }, (err, resultUpdate) => {
          const userUpdate = resultUpdate.rows[0]
          if (userUpdate.email === user.email) {
            return response(res, 'Create Pin Success', resultUpdate.rows[0])
          }
        })
      } else {
        return response(res, 'Error: pin already set', null, null, 400)
      }
    } else {
      return response(res, 'Error: Email does not exists', null, null, 400)
    }
  })
}

exports.login = (req, res) => {
  const { email, password, tokenNotif } = req.body
  userModel.getUserByEmail(email, (err, results) => {
    if (results.rows.length < 1) {
      return response(res, 'User not found', null, null, 400)
    }
    const user = results.rows[0]
    bcrypt
      .compare(password, user.password)
      .then((cpRes) => {
        // console.log(cpRes);
        if (cpRes) {
          const token = jwt.sign({ id: user.id }, process.env.APP_SECRET || 'secretKey', { expiresIn: '24h' })
          const id = user.id
          const pin = user.pin
          const email = user.email
          if (tokenNotif !== null && tokenNotif !== undefined) {
            notifModel.updateUserToken(id, tokenNotif, (err) => {
              if (err) {
                return errorResponse(err, res)
              }
              const message = { notification: { title: 'login', body: `wellcome ${user.email}` } }
              admin
                .messaging()
                .sendToDevice(tokenNotif, message, { priority: 'high' })
                .then((response) => {
                  console.log(response)
                })
                .catch(console.log('error'))
              // return response(res, 'Login success', {id, pin, token, email});
            })
          }
          return response(res, 'Login success', { id, pin, token, email })
        }
        return response(res, 'Email or Password not match', null, null, 400)
      })
      .catch(() => {
        return response(res, 'Email or Password not match', null, null, 400)
      })
  })
}

exports.register2 = (req, res) => {
  req.body.pin = null
  authmodel.register(req.body, (err) => {
    if (err) {
      return errorResponse(err, res)
    }
    return response(res, 'Register successfully')
  })
}

exports.register3 = (req, res) => {
  req.body.pin = null
  authmodel.registerMk2(req.body, (err) => {
    if (err) {
      return errorResponse(err, res)
    }
    return response(res, 'Register successfully')
  })
}

exports.createTokenNotif = (req, res) => {
  const { token } = req.body
  notifModel.getDataByToken(token, (err, results) => {
    // return response(res, 'set token successfully', results.rows.length);
    if (results.rows.length > 0) {
      return response(res, 'Error: token already exits', null, null, 400)
    } else {
      notifModel.createToken(token, (err, resultsToken) => {
        if (err) {
          return errorResponse(err, res)
        }
        return response(res, 'set token successfully', resultsToken)
      })
    }
  })
}

exports.removeUserFromToken = (req, res) => {
  const { token } = req.body
  notifModel.deleteUserToken(token, (err) => {
    if (err) {
      return errorResponse(err, res)
    }
    return response(res, 'delete user from token successfully')
  })
}
