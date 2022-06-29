const transactions = require('express').Router();

const transactionsControllers = require('../controllers/transactions');

transactions.get('/', transactionsControllers.getTransactions);
transactions.get('/:id', transactionsControllers.searchUserById);

// error karena jika recipient_id,sender_id,type_id sama setiap id akan terjadi error
// note: posisi primary, uniq, dan foren key sudah di setting di database
transactions.post('/', transactionsControllers.createTransaction);

transactions.delete('/:id', transactionsControllers.deleteTransaction);

module.exports = transactions;