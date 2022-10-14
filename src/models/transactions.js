const db = require('../helpers/db')
const { LIMIT_DATA } = process.env

exports.getAllTransactions = (cb) => {
  db.query('SELECT * FROM transactions ORDER BY id ASC', (err, res) => {
    cb(res.rows)
  })
}

exports.createTransaction = (data, cb) => {
  const q =
    'INSERT INTO transactions(amount, recipient_id, sender_id, note, time, type_id_trans) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
  const val = [data.amount, data.recipient_id, data.sender_id, data.note, data.time, data.type_id_trans]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}

exports.updateTransaction = (id, data, cb) => {
  const q =
    'UPDATE transactions SET amount=$1, recipient_id=$2, sender_id=$3, note=$4, time=$5, type_id_trans=$6 WHERE id=$7 RETURNING *'
  const val = [data.amount, data.recipient_id, data.sender_id, data.note, data.time, data.type_id_trans, id]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res.rows)
    } else {
      cb(err)
    }
  })
}

exports.deleteProfile = (id, cb) => {
  const q = 'DELETE FROM transactions WHERE id=$1 RETURNING *'
  const val = [id]
  db.query(q, val, (err, res) => {
    cb(res.rows)
  })
}

exports.getTransactionById = (id, cb) => {
  const q = 'SELECT * FROM transactions WHERE id=$1'
  const val = [id]
  db.query(q, val, (err, res) => {
    cb(res.rows)
  })
}

exports.searchSortTrans = (searchBy, keyword, sort_by, sort_type, limit = parseInt(LIMIT_DATA), offset = 0, cb) => {
  db.query(
    `SELECT * FROM transactions WHERE ${searchBy} LIKE '%${keyword}%' ORDER BY ${sort_by} ${sort_type} LIMIT $1 OFFSET $2`,
    [limit, offset],
    (err, res) => {
      console.log(res)
      cb(res.rows)
    }
  )
}

exports.countAllTrans = (keyword, cb) => {
  db.query(`SELECT * FROM transactions WHERE note LIKE '%${keyword}%'`, (err, res) => {
    cb(err, res.rowCount)
  })
}

// withAuth
// exports.searchSortTranswithAuth = (search, sort_by, sort_type, limit=parseInt(LIMIT_DATA), offset=0, cb)=>{
//   db.query(`SELECT * FROM transactions WHERE recipient_id LIKE '%${search}%' ORDER BY ${sort_by} ${sort_type} LIMIT $1 OFFSET $2`, [limit, offset], (err, res)=>{
//     // console.log(res);
//     cb(res.rows);
//   });
// };

exports.countAllTranswithAuth = (search, cb) => {
  db.query(`SELECT * FROM transactions WHERE recipient_id LIKE '%${search}%'`, (err, res) => {
    cb(err, res.rowCount)
  })
}

exports.createTransactionwithAuth = (sender_id, data, cb) => {
  const q =
    'INSERT INTO transactions(amount, recipient_id, sender_id, note, time, type_id_trans) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
  const val = [data.amount, data.recipient_id, sender_id, data.note, data.time, data.type_id_trans]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}
