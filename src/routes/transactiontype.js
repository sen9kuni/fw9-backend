const transactiontype = require('express').Router();

const transactionsTypeControllers = require('../controllers/transactiontype');

transactiontype.get('/', transactionsTypeControllers.getAllTransactionType);
transactiontype.get('/:id', transactionsTypeControllers.searchTransactionTypeById);
transactiontype.post('/', transactionsTypeControllers.createTransactionType);
transactiontype.patch('/:id', transactionsTypeControllers.editTransactionType);
transactiontype.delete('/:id', transactionsTypeControllers.deleteTransactionType);

module.exports = transactiontype;