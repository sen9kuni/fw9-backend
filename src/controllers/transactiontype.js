const response = require('../helpers/standardRespond');

const transactionTypeModel = require('../models/transactiontype');

exports.getAllTransactionType = (req, res)=>{
  transactionTypeModel.getAllTransactionType((result)=>{
    return response(res, 'Show transaction types', result);
  });
};


exports.createTransactionType = (req, res)=> {
  transactionTypeModel.createTransactionType(req.body, (results)=>{
    return response(res, 'Create type transaction successfully', results[0]);
  });
};


exports.editTransactionType = (req, res)=> {
  const {id} = req.params;
  transactionTypeModel.updateTransactionType(id, req.body, (results)=>{
    return response(res, 'Update type transaction success!', results[0]);
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