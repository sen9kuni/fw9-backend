const transactiontype = require('express').Router();

const transactionsTypeControllers = require('../controllers/transactiontype');

const { body } = require('express-validator');

// var validator
const createTransactionsTypeValidator = [
  body('name').isLength({min: 4}).withMessage('Username length minimal 4 character')
];

const editTransactionsTypeValidator = [
  body('name').isLength({min: 4}).withMessage('Username length minimal 4 character')
];
// end var validator

transactiontype.get('/', transactionsTypeControllers.getAllTransactionType);
transactiontype.get('/:id', transactionsTypeControllers.searchTransactionTypeById);
transactiontype.post('/', ...createTransactionsTypeValidator, transactionsTypeControllers.createTransactionType);
transactiontype.patch('/:id', ...editTransactionsTypeValidator, transactionsTypeControllers.editTransactionType);
transactiontype.delete('/:id', transactionsTypeControllers.deleteTransactionType);

module.exports = transactiontype;