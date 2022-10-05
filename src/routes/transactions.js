const transactions = require('express').Router()

const transactionsControllers = require('../controllers/transactions')

const { body } = require('express-validator')

const createTransactionsValidator = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must number')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Wrong input amount')
]

const editTransactionsValidator = [body('amount').isNumeric().withMessage('Amount must number')]

transactions.get('/', body('limit').toInt(), body('page').toInt(), transactionsControllers.searchSortTrans)
transactions.get('/:id', transactionsControllers.getTransactionById)

// error karena jika recipient_id,sender_id,type_id sama setiap id akan terjadi error
// note: posisi primary, uniq, dan foren key sudah di setting di database
transactions.post('/', ...createTransactionsValidator, transactionsControllers.createTransaction)
transactions.patch('/:id', ...editTransactionsValidator, transactionsControllers.editTransaction)
transactions.delete('/:id', transactionsControllers.deleteTransaction)

module.exports = transactions
