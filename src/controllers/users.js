const response = require('../helpers/standardRespond');
const userModel = require('../models/users');
const { validationResult } = require('express-validator');
const errorResponse = require('../helpers/errorResponse');

exports.getAllUsers = (req, res)=>{
  userModel.getAllUsers((results)=>{
    return response(res, 'show users', results);
  });
};


exports.createUser = (req, res)=>{
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }

  userModel.createUser(req.body, (err, results)=>{
    if (err) {
      if (err.code === '23505' && err.detail.includes('email')) {
        const errorRes = errorResponse('Email already exists', 'email');
        return response(res, 'Error', errorRes, 400);
      }else if(err.code === '23505' && err.detail.includes('username')){
        const errorRes = errorResponse('Username already exists', 'username');
        return response(res, 'Error', errorRes, 400);
      }
      return response(res, 'Error', null, 400);
    }else{
      return response(res, 'Create user successfully', results[0]);
    }
  });
};


exports.editUser = (req, res)=>{
  const {id} = req.params;
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }

  userModel.updateUser(id, req.body, (err, results)=>{
    if (err) {
      if (err.code === '23505' && err.detail.includes('email')) {
        const errorRes = errorResponse('Email already exists', 'email');
        return response(res, 'Error', errorRes, 400);
      }else if(err.code === '23505' && err.detail.includes('username')){
        const errorRes = errorResponse('Username already exists', 'username');
        return response(res, 'Error', errorRes, 400);
      }
      return response(res, 'Error', null, 400);
    }else{
      return response(res, 'Edit user successfully', results[0]);
    }
  });
  // const {id} = req.params;
  // userModel.updateUser(id, req.body, (results)=>{
  //   return response(res, 'Update user success!', results[0]);
  // });
};


exports.deleteUser = (req, res)=>{
  const {id} = req.params;
  userModel.deleteUser(id, (results)=>{
    return response(res, 'User deleted', results[0]);
  });
};

exports.searchUserById = (req, res)=>{
  const {id} = req.params;
  userModel.searchUserById(id, (results)=>{
    return response(res, 'User search', results[0]);
  });
};