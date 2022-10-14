const db = require('../helpers/db')
const { LIMIT_DATA } = process.env

exports.createToken = (token, cb) => {
  const q = 'INSERT INTO fcm_token(token) VALUES ($1) RETURNING *'
  const val = [token]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res.rows[0])
    } else {
      cb(err)
    }
  })
}

exports.createNotif = (sender_id, receiver_id, trans_id, cb) => {
  const q = 'INSERT INTO notification(sender_id, receiver_id, trans_id, is_read) VALUES ($1, $2, $3, $4)'
  const val = [sender_id, receiver_id, trans_id, false]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}

exports.updateUserToken = (user_id, token, cb) => {
  const q = 'UPDATE fcm_token SET user_id=$1 WHERE token=$2'
  const val = [user_id, token]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}

exports.deleteUserToken = (token, cb) => {
  const q = 'UPDATE fcm_token SET user_id = NULL WHERE token=$1'
  const val = [token]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}

exports.getDataByToken = (token, cb) => {
  const q = 'SELECT * FROM fcm_token WHERE token=$1'
  const val = [token]
  db.query(q, val, (err, res) => {
    cb(err, res)
  })
}

exports.getDataById = (id, cb) => {
  const q = 'SELECT * FROM fcm_token WHERE user_id=$1'
  const val = [id]
  db.query(q, val, (err, res) => {
    cb(err, res)
  })
}

exports.getJoinNotifs = (id, limit = parseInt(LIMIT_DATA), sort_by, offset = 0, cb) => {
  const q = `SELECT notification.id, notification.created_at, trans_id, is_read, t1.amount, t3.name type, t2.user_id receiverId, t2.first_name receiverFirstName, t2.last_name receiverLastName, t2.picture imgReceiver, t2.phonenumber receiverPhonenumber, t4.first_name senderFirstName, t4.last_name senderLastName, t4.picture imgSender FROM notification FULL OUTER JOIN transactions t1 on t1.id = notification.trans_id FULL OUTER JOIN transaction_type t3 on t3.id = t1.type_id_trans FULL OUTER JOIN profile t2 on t2.user_id = t1.recipient_id FULL OUTER JOIN profile t4 on t4.user_id = t1.sender_id WHERE notification.user_id= ${id} AND notification.is_read = FALSE ORDER BY created_at ${sort_by} LIMIT $1 OFFSET $2`
  const val = [limit, offset]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res.rows)
    } else {
      cb(err)
    }
  })
}

exports.getJoinNotifsCount = (id, cb) => {
  db.query(`SELECT * FROM notification WHERE user_id=${id} AND is_read = FALSE`, (err, res) => {
    cb(err, res.rowCount)
  })
}

exports.getAllNotifs = (id, sort_by, cb) => {
  db.query(
    `SELECT notification.id, notification.created_at, trans_id, is_read, t1.amount, t3.name type, t2.user_id receiverId, t2.first_name receiverFirstName, t2.last_name receiverLastName, t2.picture imgReceiver, t2.phonenumber receiverPhonenumber, t4.first_name senderFirstName, t4.last_name senderLastName, t4.picture imgSender FROM notification FULL OUTER JOIN transactions t1 on t1.id = notification.trans_id FULL OUTER JOIN transaction_type t3 on t3.id = t1.type_id_trans FULL OUTER JOIN profile t2 on t2.user_id = t1.recipient_id FULL OUTER JOIN profile t4 on t4.user_id = t1.sender_id WHERE notification.user_id= ${id} AND notification.is_read = FALSE ORDER BY created_at ${sort_by}`,
    (err, res) => {
      cb(err, res.rows)
    }
  )
}

exports.readNotif = (id, cb) => {
  const q = 'UPDATE notification SET is_read=true WHERE id=$1 RETURNING *'
  const val = [id]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res.rows)
    } else {
      cb(err)
    }
  })
}

exports.readAllNotifs = (user_id, cb) => {
  const q = 'UPDATE notification SET is_read=true WHERE user_id=$1'
  const val = [user_id]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}
