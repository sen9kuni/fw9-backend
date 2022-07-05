const response = require('../helpers/standardRespond');
const transactionModel = require('../models/transactions');
const { validationResult } = require('express-validator');
// const errorResponse = require('../helpers/errorResponse');

exports.getTransactions = (req, res) => {
  transactionModel.getAllTransactions((results)=>{
    return response(res, 'Show transactions', results);
  });
};


exports.createTransaction = (req, res)=>{
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }

  transactionModel.createTransaction(req.body, (err, results)=>{
    if (err) {
      return response(err, res);
    } else {
      return response(res, 'Create transaction successfully', results.rows[0]);
    }
  });
};

exports.editTransaction = (req, res)=> {
  const {id} = req.params;
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400);
  }

  transactionModel.updateTransaction(id, req.body, (err, results)=>{
    if (err) {
      return response(res, 'Error', null, 400);
    } else {
      return response(res, 'Create transaction successfully', results[0]);
    }
  });
};

exports.deleteTransaction = (req, res)=>{
  const {id} = req.params;
  transactionModel.deleteProfile(id, (results)=>{
    return response(res, 'transaction deleted', results[0]);
  });
};

exports.searchUserById = (req, res)=>{
  const {id} = req.params;
  transactionModel.searchTransactionById(id, (results)=>{
    return response(res, 'transaction search', results[0]);
  });
};