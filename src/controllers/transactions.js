const response = require('../helpers/standardRespond');

exports.getTransactions = (req, res) => {
  return response(res, 'Message from standard get respones Transactions');
};

exports.postTransactions = (req, res) => {
  return response(res, 'Message from standard post respones Transactions');
};

exports.putTransactions = (req, res) => {
  return response(res, 'Message from standard put respones Transactions');
};

exports.deleteTransactions = (req, res) => {
  return response(res, 'Message from standard delete respones Transactions');
};