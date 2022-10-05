const response = require('../helpers/standardRespond')
const profileModel = require('../models/profile')
const { LIMIT_DATA } = process.env

exports.createProfile = (req, res) => {
  let filename = null

  if (req.file) {
    filename = req.file.filename
  }

  profileModel.createProfile(filename, req.body, (err, results) => {
    if (err) {
      return response(res, `Failed to update: ${err.message}`, null, null, 400)
    }
    return response(res, 'Profile updated', results.rows[0])
  })
}

exports.editProfile = (req, res) => {
  const { id } = req.params
  let filename = null

  if (req.file) {
    filename = req.file.filename
  }

  profileModel.updateProfile(id, filename, req.body, (err, results) => {
    if (err) {
      return response(res, `Failed to update: ${err.message}`, null, null, 400)
    }
    return response(res, 'Profile updated', results.rows[0])
  })
}

exports.deleteProfile = (req, res) => {
  const { id } = req.params
  profileModel.deleteProfile(id, (results) => {
    return response(res, 'profile deleted', results[0])
  })
}

exports.getProfileById = (req, res) => {
  const { id } = req.params
  profileModel.getProfileById(id, (results) => {
    return response(res, 'Profile search', results[0])
  })
}

exports.searchSortProfile = (req, res) => {
  const {
    searchBy = '',
    search = '',
    sort_by = '',
    sort_type = 'ASC',
    limit = parseInt(LIMIT_DATA),
    page = 1
  } = req.query

  const offset = (page - 1) * limit
  profileModel.searchSortProfile(searchBy, search, sort_by, sort_type, limit, offset, (results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    profileModel.countAllProfile(search, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List all Profile search', results, pageInfo)
    })
  })
}
