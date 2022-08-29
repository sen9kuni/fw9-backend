const userModel = require('../models/users');
const authmodel = require('../models/authenticated');
const response = require('../helpers/standardRespond');
const errorResponse = require('../helpers/errorResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = (req, res) => {
  req.body.pin = null;
  userModel.createUser(req.body, (err)=> {
    if(err){
      return errorResponse(err, res);
    }
    return response(res, 'Register successfully');
  });
};

exports.createPin = (req, res) => {
  const {email}= req.body;
  userModel.getUserByEmail(email, (err, results)=>{
    if (results.rows.length > 0) {
      const user = results.rows[0];
      if (user.pin === null) {
        userModel.updateUser(user.id, {pin: req.body.pin}, (err, resultUpdate)=>{
          const userUpdate = resultUpdate.rows[0];
          if (userUpdate.email === user.email) {
            return response(res, 'Create Pin Success');
          }
        });
      } else {
        return response(res, 'Error: pin already set', null, null, 400);
      }
    } else {
      return response(res, 'Error: Email does not exists', null, null, 400);
    }
  });
};

exports.login = (req, res)=> {
  const {email, password} = req.body;
  userModel.getUserByEmail(email, (err, results)=>{
    if (results.rows.length < 1) {
      return response(res, 'User not found', null, null, 400);
    }
    const user = results.rows[0];
    bcrypt.compare(password, user.password)
      .then((cpRes)=>{
        // console.log(cpRes);
        if (cpRes) {
          const token = jwt.sign({id: user.id}, process.env.APP_SECRET || 'secretKey');
          const id = user.id;
          const pin = user.pin;
          return response(res, 'Login success', {id, pin, token});
        }
        return response(res, 'Email or Password not match', null, null, 400);
      })
      .catch(() =>{
        return response(res, 'Email or Password not match', null, null, 400);
      });
  });
};

exports.register2 = (req, res) =>{
  req.body.pin = null;
  authmodel.register(req.body, (err)=> {
    if(err){
      return errorResponse(err, res);
    }
    return response(res, 'Register successfully');
  });
};