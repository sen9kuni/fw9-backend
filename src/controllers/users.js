const response = require('../helpers/standardRespond');
const userModel = require('../models/users');
const { validationResult } = require('express-validator');
const errorResponse = require('../helpers/errorResponse');
const {LIMIT_DATA} = process.env;

exports.getAllUsers = (req, res)=>{
  userModel.getAllUsers((results)=>{
    return response(res, 'show users', results);
  });
};


exports.createUser = (req, res)=>{
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), null, 400);
  }

  userModel.createUser(req.body, (err, results)=>{
    if (err) {
      return errorResponse(err, res);
    }else{
      return response(res, 'Create user successfully', results[0]);
    }
  });
};


exports.editUser = (req, res)=>{
  const {id} = req.params;
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), null, 400);
  }

  userModel.updateUser(id, req.body, (err, results)=>{
    if (err) {
      return errorResponse(err, res);
    }else{
      return response(res, 'Edit user successfully', results[0]);
    }
  });
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
    // if (res.rows.length > 0) {
    return response(res, 'User search', results[0]);
    // } else {
    //   return res.redirect('/404');
    // }
  });
};


// base
exports.searchSortUsers = (req, res) => {
  const {search = '', limit=parseInt(LIMIT_DATA), page=1} = req.query;

  const offset = (page - 1) * limit;
  userModel.searchSortUsers(search, limit, offset, (results)=>{
    if (results.length < 1) {
      return res.redirect('/404');
    }
    const pageInfo = {};
    // return response(res, 'List all User search', results, pageInfo);

    userModel.countAllUsers(search, (err, totalData)=>{
      pageInfo.totalData = totalData;
      pageInfo.totalPage = Math.ceil(totalData/limit);
      pageInfo.currentPage = parseInt(page);
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null;
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
      return response(res, 'List all User search', results, pageInfo);
    });
  });
};


// experiment
// exports.searchSortUsers = (req, res) => {
//   const {table_name='', search = '', limit=parseInt(LIMIT_DATA), page=1} = req.query;

//   const offset = (page - 1) * limit;
//   userModel.searchSortUsers(table_name, search, limit, offset, (results)=>{
//     if (results.length < 1) {
//       return res.redirect('/404');
//     }
//     const pageInfo = {};
//     // return response(res, 'List all User search', results, pageInfo);

//     userModel.countAllUsers(search, (err, totalData)=>{
//       pageInfo.totalData = totalData;
//       pageInfo.totalPage = Math.ceil(totalData/limit);
//       pageInfo.currentPage = parseInt(page);
//       pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null;
//       pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
//       return response(res, 'List all User search', results, pageInfo);
//     });
//   });
// };