const response = require('../helpers/standardRespond');

const transactionModel = require('../models/transactions');

exports.getTransactions = (req, res) => {
  transactionModel.getAllTransactions((results)=>{
    return response(res, 'Show transactions', results);
  });
};


exports.createTransaction = (req, res)=>{
  transactionModel.createTransaction(req.body, (results)=>{
    return response(res, 'Create transaction successfully', results[0]);
  });
};

exports.deleteTransaction = (req, res)=>{
  const {id} = req.params;
  transactionModel.deleteProfile(id, (results)=>{
    return response(res, 'Profile deleted', results[0]);
  });
};