const response = require('../helpers/standardRespond');

const profileModel = require('../models/profile');

exports.getAllProfile = (req, res)=>{
  profileModel.getAllProfile((results)=>{
    return response(res, 'Message from standard get respones users', results);
  });
};

exports.createProfile = (req, res)=>{
  profileModel.createProfile(req.body, (results)=>{
    return response(res, 'Create profile successfully', results[0]);
  });
};

exports.editProfile = (req, res)=>{
  const {id} = req.params;
  profileModel.updateProfile(id, req.body, (results)=>{
    return response(res, 'Update user success!', results[0]);
  });
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