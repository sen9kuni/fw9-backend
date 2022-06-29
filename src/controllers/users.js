const response = require('../helpers/standardRespond');

const userModel = require('../models/users');

exports.getAllUsers = (req, res)=>{
  userModel.getAllUsers((results)=>{
    return response(res, 'show users', results);
  });
};


exports.createUser = (req, res)=>{
  userModel.createUser(req.body, (results)=>{
    return response(res, 'Create user successfully', results[0]);
  });
};


exports.editUser = (req, res)=>{
  const {id} = req.params;
  userModel.updateUser(id, req.body, (results)=>{
    return response(res, 'Update user success!', results[0]);
  });
};


exports.deleteUser = (req, res)=>{
  const {id} = req.params;
  userModel.deleteUser(id, (results)=>{
    return response(res, 'User deleted', results[0]);
  });
};