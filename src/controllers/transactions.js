const response = require('../helpers/standardRespond')
const transactionModel = require('../models/transactions')
const { validationResult } = require('express-validator')
const { LIMIT_DATA } = process.env

exports.createTransaction = (req, res) => {
  const validation = validationResult(req)

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400)
  }

  transactionModel.createTransaction(req.body, (err, results) => {
    if (err) {
      return response(err, res)
    } else {
      return response(res, 'Create transaction successfully', results.rows[0])
    }
  })
}

exports.editTransaction = (req, res) => {
  const { id } = req.params
  const validation = validationResult(req)

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400)
  }

  transactionModel.updateTransaction(id, req.body, (err, results) => {
    if (err) {
      return response(res, 'Error', null, 400)
    } else {
      return response(res, 'Create transaction successfully', results[0])
    }
  })
}

exports.deleteTransaction = (req, res) => {
  const { id } = req.params
  transactionModel.deleteProfile(id, (results) => {
    return response(res, 'transaction deleted', results[0])
  })
}

exports.getTransactionById = (req, res) => {
  const { id } = req.params
  transactionModel.getTransactionById(id, (results) => {
    return response(res, 'transaction search', results[0])
  })
}

exports.searchSortTrans = (req, res) => {
  const {
    searchBy = '',
    search = '',
    sort_by = '',
    sort_type = 'ASC',
    limit = parseInt(LIMIT_DATA),
    page = 1
  } = req.query

  const offset = (page - 1) * limit
  transactionModel.searchSortTrans(searchBy, search, sort_by, sort_type, limit, offset, (results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    transactionModel.countAllTrans(search, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List all Transaction search', results, pageInfo)
    })
  })
}
