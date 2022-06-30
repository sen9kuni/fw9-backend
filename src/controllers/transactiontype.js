const response = require('../helpers/standardRespond');
const transactionTypeModel = require('../models/transactiontype');
const { validationResult } = require('express-validator');
const errorResponse = require('../helpers/errorResponse');

exports.getAllTransactionType = (req, res)=>{
  transactionTypeModel.getAllTransactionType((result)=>{
    return response(res, 'Show transaction types', result);
  });
};


exports.createTransactionType = (req, res)=> {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }
  
  transactionTypeModel.createTransactionType(req.body, (err, results)=>{
    if (err) {
      if (err.code === '23505' && err.detail.includes('name')) {
        const errorRes = errorResponse('Name already exists', 'email');
        return response(res, 'Error', errorRes, 400);
      }
      return response(res, 'Error', null, 400);
    } else {
      return response(res, 'Create type transaction successfully', results[0]);
    }
  });
};


exports.editTransactionType = (req, res)=> {
  const {id} = req.params;
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }
  
  transactionTypeModel.updateTransactionType(id, req.body, (err, results)=>{
    if (err) {
      if (err.code === '23505' && err.detail.includes('name')) {
        const errorRes = errorResponse('Name already exists', 'email');
        return response(res, 'Error', errorRes, 400);
      }
      return response(res, 'Error', null, 400);
    } else {
      return response(res, 'edit type transaction successfully', results[0]);
    }
  });
};


exports.deleteTransactionType = (req, res)=> {
  const {id} = req.params;
  transactionTypeModel.deleteTransactionType(id, (results)=>{
    return response(res, 'Type transaction deleted', results[0]);
  });
};

exports.searchTransactionTypeById = (req, res)=>{
  const {id} = req.params;
  transactionTypeModel.searchTransactionTypeById(id, (results)=>{
    return response(res, 'User search', results[0]);
  });
};