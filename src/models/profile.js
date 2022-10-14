const db = require('../helpers/db')
const { LIMIT_DATA } = process.env

exports.getAllProfile = (cb) => {
  db.query('SELECT * FROM profile', (err, res) => {
    cb(res.rows)
  })
}

exports.createProfile = (picture, data, cb) => {
  let val = []
  const filtered = {}
  const objet = {
    picture,
    fullname: data.fullname,
    balance: data.balance,
    phonenumber: data.phonenumber,
    user_id: data.user_id
  }

  for (let x in objet) {
    if (objet[x] !== null) {
      filtered[x] = objet[x]
      val.push(objet[x])
    }
  }

  const key = Object.keys(filtered)
  const finalResult = key.map((o, ind) => `$${(o = ind + 1)}`)

  const q = `INSERT INTO profile(${key}) VALUES (${finalResult}) RETURNING *`
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err, res)
    }
  })
}

exports.updateProfile = (id, picture, data, cb) => {
  let val = [id]

  const filtered = {}

  const objt = {
    picture,
    fullname: data.fullname,
    balance: data.balance,
    phonenumber: data.phonenumber
  }

  for (let x in objt) {
    if (objt[x] !== null) {
      filtered[x] = objt[x]
      val.push(objt[x])
    }
  }

  const key = Object.keys(filtered)
  const finalResult = key.map((o, ind) => `${o}=$${ind + 2}`)

  const q = `UPDATE profile SET ${finalResult} WHERE id=$1 RETURNING *`
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err, res)
    }
  })
}

exports.deleteProfile = (id, cb) => {
  const q = 'DELETE FROM profile WHERE id=$1 RETURNING *'
  const val = [id]
  db.query(q, val, (err, res) => {
    cb(res.rows)
  })
}

exports.getProfileById = (id, cb) => {
  const q = 'SELECT * FROM profile WHERE id=$1'
  const val = [id]
  db.query(q, val, (err, res) => {
    // console.log(res);
    cb(err, res)
  })
}

exports.getProfileByUserIdAuth = (user_id, cb) => {
  const q = 'SELECT * FROM profile WHERE user_id=$1'
  const val = [user_id]
  db.query(q, val, (err, res) => {
    cb(err, res)
  })
}

exports.getProfileByUserId = (user_id, cb) => {
  const q = 'SELECT first_name, last_name, fullname, phonenumber, picture, balance FROM profile WHERE user_id=$1'
  const val = [user_id]
  db.query(q, val, (err, res) => {
    cb(res.rows)
  })
}

exports.getProfileByUserIdTf = (user_id, cb) => {
  const q = 'SELECT * FROM profile WHERE user_id=$1'
  const val = [user_id]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}

exports.searchSortProfile = (searchBy, keyword, sort_by, sort_type, limit = parseInt(LIMIT_DATA), offset = 0, cb) => {
  db.query(
    `SELECT * FROM profile WHERE ${searchBy} LIKE '%${keyword}%' ORDER BY ${sort_by} ${sort_type} LIMIT $1 OFFSET $2`,
    [limit, offset],
    (err, res) => {
      cb(res.rows)
    }
  )
}

exports.countAllProfile = (keyword, cb) => {
  db.query(`SELECT * FROM profile WHERE fullname LIKE '%${keyword}%'`, (err, res) => {
    cb(err, res.rowCount)
  })
}

// auth
exports.updateProfileAuth = (user_id, picture, fullname, phonenumber, first_name, last_name, cb) => {
  let val = [user_id]

  const filtered = {}

  const objt = {
    picture,
    fullname,
    phonenumber,
    first_name,
    last_name
  }

  for (let x in objt) {
    if (objt[x] !== null) {
      if (objt[x] !== undefined) {
        filtered[x] = objt[x]
        val.push(objt[x])
      }
    }
  }
  const key = Object.keys(filtered)
  const finalResult = key.map((o, ind) => `${o}=$${ind + 2}`)
  const q = `UPDATE profile SET ${finalResult} WHERE user_id=$1 RETURNING first_name, last_name, fullname, phonenumber, picture, balance`
  db.query(q, val, (err, res) => {
    cb(err, res)
  })
}

exports.updateProfileName = (user_id, first_name, last_name, cb) => {
  let val = [user_id]

  const filtered = {}

  const objt = {
    first_name,
    last_name
  }

  for (let x in objt) {
    if (objt[x] !== null) {
      if (objt[x] !== undefined) {
        if (objt[x] !== '') {
          filtered[x] = objt[x]
          val.push(objt[x])
        }
      }
    }
  }
  const key = Object.keys(filtered)
  const finalResult = key.map((o, ind) => `${o}=$${ind + 2}`)
  const q = `UPDATE profile SET ${finalResult} WHERE user_id=$1 RETURNING first_name, last_name, fullname, phonenumber, picture, balance`
  db.query(q, val, (err, res) => {
    cb(err, res.rows[0])
  })
}

exports.changePhoneNumber = (user_id, data, cb) => {
  const q = 'UPDATE profile SET phonenumber=$1 WHERE user_id=$2 RETURNING phonenumber'
  const val = [data.phonenumber, user_id]
  db.query(q, val, (err, res) => {
    if (res) {
      cb(err, res)
    } else {
      cb(err)
    }
  })
}
