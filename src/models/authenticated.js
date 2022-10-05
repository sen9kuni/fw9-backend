const db = require('../helpers/db')
const { LIMIT_DATA } = process.env

exports.register = (data, cb) => {
  db.query('BEGIN', (err) => {
    if (err) {
      cb(err)
    } else {
      const q = 'INSERT INTO users(email, password, username) VALUES ($1, $2, $3) RETURNING id'
      const val = [data.email, data.password, data.username]
      db.query(q, val, (err, res) => {
        if (err) {
          cb(err)
        } else {
          const insertprofile = 'INSERT INTO profile(user_id) VALUES ($1)'
          const insertprofileVal = [res.rows[0].id]
          db.query(insertprofile, insertprofileVal, (err, res) => {
            if (err) {
              cb(err)
            } else {
              cb(err, res)
              db.query('COMMIT', (err) => {
                if (err) {
                  console.error('Error registrasion', err.stack)
                }
              })
            }
          })
        }
      })
    }
  })
}

exports.registerMk2 = (data, cb) => {
  db.query('BEGIN', (err) => {
    if (err) {
      cb(err)
    } else {
      const q = 'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING id'
      const val = [data.email, data.password]
      db.query(q, val, (err, res) => {
        if (err) {
          cb(err)
        } else {
          const insertprofile = 'INSERT INTO profile(user_id, first_name, last_name) VALUES ($1, $2, $3)'
          const insertprofileVal = [res.rows[0].id, data.first_name, data.last_name]
          db.query(insertprofile, insertprofileVal, (err, res) => {
            if (err) {
              cb(err)
            } else {
              cb(err, res)
              db.query('COMMIT', (err) => {
                if (err) {
                  console.error('Error registrasion', err.stack)
                }
              })
            }
          })
        }
      })
    }
  })
}

exports.trasfer = (sender_id, amount, data, cb) => {
  db.query('BEGIN', (err) => {
    if (err) {
      cb(err)
    } else {
      const q =
        'INSERT INTO transactions(amount, recipient_id, sender_id, note, time, type_id_trans) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, amount, recipient_id, sender_id, note, time, type_id_trans'
      const val = [amount, data.recipient_id, sender_id, data.note, data.time, data.type_id_trans]
      db.query(q, val, (err, res1) => {
        if (err) {
          cb(err)
        } else {
          const updateProfileSender = 'UPDATE profile SET balance = balance - $1 WHERE user_id = $2'
          const valProfileSender = [amount, res1.rows[0].sender_id]
          db.query(updateProfileSender, valProfileSender, (err, res) => {
            if (err) {
              cb(err)
            } else {
              const updateProfileRecv = 'UPDATE profile SET balance = balance + $1 WHERE user_id = $2'
              const valProfileRecv = [amount, data.recipient_id]
              db.query(updateProfileRecv, valProfileRecv, (err, res) => {
                if (err) {
                  cb(err)
                } else {
                  const q = 'INSERT INTO notification(user_id, trans_id) VALUES ($1, $2)'
                  const val = [sender_id, res1.rows[0].id]
                  db.query(q, val, (err, res) => {
                    if (err) {
                      cb(err)
                    } else {
                      cb(err, res1)
                      db.query('COMMIT', (err) => {
                        if (err) {
                          console.error('Error trasfer', err.stack)
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

exports.historyTransactions = (
  id,
  searchBy,
  keyword,
  orderBy,
  sortType,
  limit = parseInt(LIMIT_DATA),
  offset = 0,
  cb
) => {
  const q = `SELECT * FROM transactions WHERE recipient_id=${id} OR sender_id=${id} AND ${searchBy} LIKE '%${keyword}%' ORDER BY ${orderBy} ${sortType} LIMIT $1 OFFSET $2`
  const val = [limit, offset]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res.rows)
    } else {
      cb(err)
    }
  })
}

exports.countHistoryTransactions = (id, searchBy, keyword, cb) => {
  db.query(
    `SELECT * FROM transactions WHERE recipient_id=${id} OR sender_id=${id} AND ${searchBy} LIKE '%${keyword}%'`,
    (err, res) => {
      cb(err, res.rowCount)
    }
  )
}

exports.topUp = (recipient_id, amount, type_id_trans, data, cb) => {
  db.query('BEGIN', (err) => {
    if (err) {
      cb(err)
    } else {
      const q =
        'INSERT INTO transactions(amount, recipient_id, note, time, type_id_trans) VALUES ($1, $2, $3, $4, $5) RETURNING id, amount, recipient_id, note, time, type_id_trans'
      const val = [amount, recipient_id, data.note, data.time, type_id_trans]
      db.query(q, val, (err, res1) => {
        if (err) {
          cb(err)
        } else {
          const updateProfileSender = 'UPDATE profile SET balance = balance + $1 WHERE user_id = $2'
          const valProfileSender = [amount, res1.rows[0].recipient_id]
          db.query(updateProfileSender, valProfileSender, (err, res) => {
            if (err) {
              cb(err)
            } else {
              const q = 'INSERT INTO notification(user_id, trans_id) VALUES ($1, $2)'
              const val = [recipient_id, res1.rows[0].id]
              db.query(q, val, (err, res) => {
                if (err) {
                  cb(err)
                } else {
                  cb(err, res1)
                  db.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error trasfer', err.stack)
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

exports.getUserAndProfile = (id, cb) => {
  db.query(
    `SELECT email, username, profile.fullname, profile.first_name, profile.last_name, profile.phonenumber, profile.balance, profile.picture FROM users JOIN profile ON profile.user_id = users.id WHERE users.id = ${id}`,
    (err, res) => {
      cb(res.rows)
    }
  )
}

exports.getJoinHistoryTransactions = (id, cb) => {
  db.query(
    `SELECT transactions.id, t3.name type, amount, t1.username receiver, t2.username sender, time FROM transactions FULL OUTER JOIN users t1 ON t1.id = transactions.recipient_id FULL OUTER JOIN users t2 on t2.id = transactions.sender_id FULL OUTER JOIN transaction_type t3 on t3.id = transactions.type_id_trans WHERE transactions.recipient_id = ${id} OR transactions.sender_id = ${id} ORDER BY time ASC`,
    (err, res) => {
      cb(res.rows)
    }
  )
}

exports.getCountJoinHistoryTransactions = (id, cb) => {
  db.query(`SELECT * FROM transactions WHERE recipient_id=${id} OR sender_id=${id}`, (err, res) => {
    cb(err, res.rowCount)
  })
}

exports.getJoinHistoryTransactionsMk2 = (id, limit = parseInt(LIMIT_DATA), sort_by, offset = 0, cb) => {
  const q = `SELECT transactions.id, t3.name type, amount, note, t4.user_id receiverId, t4.first_name receiverFirstName, t4.last_name receiverLastName, t4.phonenumber phonenumberReceiver, t4.picture imgReceiver, t5.first_name senderFirstName, t5.last_name senderLastName, t5.picture imgSender, t5.phonenumber phonenumberSender, time FROM transactions FULL OUTER JOIN users t1 ON t1.id = transactions.recipient_id FULL OUTER JOIN users t2 on t2.id = transactions.sender_id FULL OUTER JOIN transaction_type t3 on t3.id = transactions.type_id_trans FULL OUTER JOIN profile t4 on t4.user_id = transactions.recipient_id FULL OUTER JOIN profile t5 on t5.user_id = transactions.sender_id WHERE transactions.recipient_id = ${id} OR transactions.sender_id = ${id} ORDER BY time ${sort_by} LIMIT $1 OFFSET $2`
  const val = [limit, offset]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res.rows)
    } else {
      cb(err)
    }
  })
}

exports.searchSortUsers = (search, sort, limit = parseInt(LIMIT_DATA), offset = 0, id, cb) => {
  db.query(
    `SELECT id, user_id, first_name, last_name, phonenumber, picture FROM profile WHERE (first_name ILIKE '%${search}%' OR last_name ILIKE '%${search}%' OR phonenumber ILIKE '%${search}%') AND user_id != ${id} ORDER BY lower(${sort}) ASC LIMIT $1 OFFSET $2`,
    [limit, offset],
    (err, res) => {
      cb(res.rows)
    }
  )
}

// option lower(${sort})

exports.countSearchSortUsers = (search, id, cb) => {
  db.query(
    `SELECT * FROM profile WHERE (first_name ILIKE '%${search}%' OR last_name ILIKE '%${search}%' OR phonenumber ILIKE '%${search}%') AND user_id != ${id}`,
    (err, res) => {
      cb(err, res.rowCount)
    }
  )
}

exports.getProfileById = (user_id, cb) => {
  db.query(
    `SELECT id, user_id, first_name, last_name, phonenumber, picture FROM profile where user_id = ${parseInt(user_id)}`,
    (err, res) => {
      if (res) {
        cb(res.rows)
      } else {
        cb(err)
      }
    }
  )
}

exports.getUserByEmail = (email, cb) => {
  db.query(`SELECT * FROM users WHERE email=${email}`, (err, res) => {
    cb(err, res)
  })
}

exports.updatePassword = (password, email, cb) => {
  db.query(`UPDATE users SET password=${password} WHERE email=${email} RETURNING *`, (err, res) => {
    if (res) {
      cb(err, res.rows)
    } else {
      cb(err)
    }
  })
}

exports.deleteImage = (user_id, cb) => {
  db.query(
    `UPDATE profile set picture = NULL WHERE user_id = ${parseInt(
      user_id
    )} RETURNING first_name, last_name, fullname, phonenumber, picture, balance`,
    (err, res) => {
      // if (res) {
      //   cb(res.rows);
      // }else{
      //   cb(err);
      // }
      cb(err, res)
    }
  )
}
