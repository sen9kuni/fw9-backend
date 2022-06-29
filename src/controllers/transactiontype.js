const response = require('../helpers/standardRespond');

const transactionTypeModel = require('../models/transactiontype');

exports.getTransactionType = (req, res)=>{
  transactionTypeModel.getAllTransactionType((results)=>{
    return response(res, 'show users', results);
  });
};