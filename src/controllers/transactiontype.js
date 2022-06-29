const response = require('../helpers/standardRespond');

const transactionTypeModel = require('../models/transactiontype');

exports.getAllTransactionType = (req, res)=>{
  transactionTypeModel.getAllTransactionType((result)=>{
    return response(res, 'Show transaction types', result);
  });
};