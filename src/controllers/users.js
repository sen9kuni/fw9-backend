const response = require('../helpers/standardRespond')
const userModel = require('../models/users')
const { validationResult } = require('express-validator')
const errorResponse = require('../helpers/errorResponse')
const { LIMIT_DATA } = process.env

exports.createUser = (req, res) => {
  const validation = validationResult(req)

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), null, 400)
  }

  userModel.createUser(req.body, (err, results) => {
    if (err) {
      return errorResponse(err, res)
    } else {
      return response(res, 'Create user successfully', results.rows[0])
    }
  })
}

exports.editUser = (req, res) => {
  const { id } = req.params
  const validation = validationResult(req)

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), null, 400)
  }

  userModel.updateUser(id, req.body, (err, results) => {
    if (err) {
      return errorResponse(err, res)
    } else {
      return response(res, 'Edit user successfully', results.rows)
    }
  })
}

exports.deleteUser = (req, res) => {
  const { id } = req.params
  userModel.deleteUser(id, (results) => {
    return response(res, 'User deleted', results[0])
  })
}

exports.getUserById = (req, res) => {
  const { id } = req.params
  userModel.getUserById(id, (results) => {
    return response(res, 'User search', results[0])
  })
}

exports.searchSortUsers = (req, res) => {
  const { column_name = '', search = '', sort_type = 'ASC', limit = parseInt(LIMIT_DATA), page = 1 } = req.query

  const offset = (page - 1) * limit
  userModel.searchSortUsers(column_name, search, sort_type, limit, offset, (results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    userModel.countAllUsers(search, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List all User search', results, pageInfo)
    })
  })
}
