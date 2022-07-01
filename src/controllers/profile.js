const response = require('../helpers/standardRespond');
const profileModel = require('../models/profile');
const { validationResult } = require('express-validator');
const errorResponse = require('../helpers/errorResponse');

exports.getAllProfile = (req, res)=>{
  profileModel.getAllProfile((results)=>{
    return response(res, 'Message from standard get respones users', results);
  });
};

exports.createProfile = (req, res)=>{
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }

  profileModel.createProfile(req.body, (err, results)=>{
    if (err) {
      return errorResponse(err, res);
    } else {
      return response(res, 'Create profile successfully', results[0]);
    }
  });
};

exports.editProfile = (req, res)=>{
  const {id} = req.params;
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }

  profileModel.updateProfile(id, req.body, (err, results)=>{
    if (err) {
      // if (err.code === '23505' && err.detail.includes('user_id')) {
      //   const errorRes = errorResponse('User id already exists', 'User Id');
      //   return response(res, 'Error', errorRes, 400);
      // }else 
      if(err.code === '23505' && err.detail.includes('phonenumber')){
        const errorRes = errorResponse('Phone number already exists', 'User Id');
        return response(res, 'Error', errorRes, 400);
      }
      return response(res, 'Error', null, 400);
    } else {
      return response(res, 'edit profile successfully', results[0]);
    }
  });
  // profileModel.updateProfile(id, req.body, (results)=>{
  //   return response(res, 'Update user success!', results[0]);
  // });
};

exports.deleteProfile = (req, res)=>{
  const {id} = req.params;
  profileModel.deleteProfile(id, (results)=>{
    return response(res, 'profile deleted', results[0]);
  });
};

exports.seacrhProfileById = (req, res)=>{
  const {id} = req.params;
  profileModel.searchProfileById(id, (results)=>{
    return response(res, 'Profile search', results[0]);
  });
};