const db = require('../helpers/db')
const { LIMIT_DATA } = process.env

exports.getAllTransactionType = (cb) => {
  db.query('SELECT * FROM transaction_type', (err, res) => {
    cb(res.rows)
  })
}

exports.createTransactionType = (data, cb) => {
  const q = 'INSERT INTO transaction_type(name, description) VALUES ($1, $2) RETURNING *'
  const val = [data.name, data.description]
  db.query(q, val, (err, res) => {
    console.log(err)
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}

exports.updateTransactionType = (id, data, cb) => {
  const q = 'UPDATE transaction_type SET name=$1, description=$2 WHERE id=$3 RETURNING *'
  const val = [data.name, data.description, id]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res.rows)
    } else {
      cb(err)
    }
  })
}

exports.deleteTransactionType = (id, cb) => {
  const q = 'DELETE FROM transaction_type WHERE id=$1 RETURNING *'
  const val = [id]
  db.query(q, val, (err, res) => {
    cb(res.rows)
  })
}

exports.getTransactionTypeById = (id, cb) => {
  const q = 'SELECT * FROM transaction_type WHERE id=$1'
  const val = [id]
  db.query(q, val, (err, res) => {
    cb(res.rows)
  })
}

exports.searchSortTransType = (searchBy, keyword, sort_by, sort_type, limit = parseInt(LIMIT_DATA), offset = 0, cb) => {
  db.query(
    `SELECT * FROM transaction_type WHERE ${searchBy} LIKE '%${keyword}%' ORDER BY ${sort_by} ${sort_type} LIMIT $1 OFFSET $2`,
    [limit, offset],
    (err, res) => {
      cb(res.rows)
    }
  )
}

exports.countAllTransType = (keyword, cb) => {
  db.query(`SELECT * FROM transaction_type WHERE name LIKE '%${keyword}%'`, (err, res) => {
    cb(err, res.rowCount)
  })
}
