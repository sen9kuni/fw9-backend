const response = require('../helpers/standardRespond')
const transactionTypeModel = require('../models/transactiontype')
const { validationResult } = require('express-validator')
const errorResponse = require('../helpers/errorResponse')
const { LIMIT_DATA } = process.env

exports.createTransactionType = (req, res) => {
  const validation = validationResult(req)

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), null, 400)
  }

  transactionTypeModel.createTransactionType(req.body, (err, results) => {
    if (err) {
      return errorResponse(err, res)
    } else {
      return response(res, 'Create type transaction successfully', results.rows[0])
    }
  })
}

exports.editTransactionType = (req, res) => {
  const { id } = req.params
  const validation = validationResult(req)

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), 400)
  }

  transactionTypeModel.updateTransactionType(id, req.body, (err, results) => {
    if (err) {
      return errorResponse(err, res)
    } else {
      return response(res, 'edit type transaction successfully', results[0])
    }
  })
}

exports.deleteTransactionType = (req, res) => {
  const { id } = req.params
  transactionTypeModel.deleteTransactionType(id, (results) => {
    return response(res, 'Type transaction deleted', results[0])
  })
}

exports.getTransactionTypeById = (req, res) => {
  const { id } = req.params
  transactionTypeModel.getTransactionTypeById(id, (results) => {
    return response(res, 'User search', results[0])
  })
}

exports.searchSortTransType = (req, res) => {
  const {
    searchBy = '',
    search = '',
    sort_by = '',
    sort_type = 'ASC',
    limit = parseInt(LIMIT_DATA),
    page = 1
  } = req.query

  const offset = (page - 1) * limit
  transactionTypeModel.searchSortTransType(searchBy, search, sort_by, sort_type, limit, offset, (results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    transactionTypeModel.countAllTransType(search, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List all Transaction type search', results, pageInfo)
    })
  })
}
