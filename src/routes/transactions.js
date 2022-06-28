const transactions = require('express').Router();

const transactionsControllers = require('../controllers/transactions');

transactions.get('/', transactionsControllers.getTransactions);
transactions.post('/', transactionsControllers.postTransactions);
transactions.put('/', transactionsControllers.putTransactions);
transactions.delete('/', transactionsControllers.deleteTransactions);

module.exports = transactions;