const response = require('../helpers/standardRespond');

const userModel = require('../models/users');

// exports.getAllUsers = (req, res) => {
//   return response(res, 'Message from standard get respones users');
// };

exports.getAllUsers = (req, res)=>{
  userModel.getAllUsers((results)=>{
    return response(res, 'Message from standard get respones users', results);
  });
};

// exports.postAllUsers = (req, res) => {
//   return response(res, 'Message from standard post respones users');
// };

// exports.putAllUsers = (req, res) => {
//   return response(res, 'Message from standard put respones users');
// };

// exports.deleteAllUsers = (req, res) => {
//   return response(res, 'Message from standard delete respones users');
// };