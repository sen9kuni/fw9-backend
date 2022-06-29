const transactiontype = require('express').Router();

const transactionsTypeControllers = require('../controllers/transactiontype');

transactiontype.get('/', transactionsTypeControllers.getAllTransactionType);