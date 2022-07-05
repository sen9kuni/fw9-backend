const db = require('../helpers/db');
const {LIMIT_DATA} = process.env;

// exports.getAllUsers = (cb) => {
//   db.query('SELECT * FROM users', (err, res)=>{
//     cb(res.rows);
//   });
// };

exports.getAllUsers = (cb) => {
  db.query('SELECT * FROM users ORDER BY id ASC', (err, res)=>{
    cb(res.rows);
  });
};

exports.createUser = (data, cb) =>{
  const q = 'INSERT INTO users(email, password, username, pin) VALUES ($1, $2, $3, $4) RETURNING *';
  const val = [data.email, data.password, data.username, data.pin];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res);
    }else{
      cb(err);
    }
  });
};

exports.updateUser = (id, data, cb)=>{
  const q = 'UPDATE users SET email=$1, password=$2, username=$3, pin=$4 WHERE id=$5 RETURNING *';
  const val = [data.email, data.password, data.username, data.pin, id];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res);
    }else{
      cb(err);
    }
  });
};

exports.deleteUser = (id, cb)=>{
  const q = 'DELETE FROM users WHERE id=$1 RETURNING *';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.searchUserById = (id, cb)=>{
  const q = 'SELECT * FROM users WHERE id=$1';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

// base
// exports.searchSortUsers = (keyword, limit=parseInt(LIMIT_DATA), offset=0, cb)=>{
//   // const q = `SELECT * FROM users ASC WHERE email LIKE \'%${keyword}%\' ORDER BY id LIMIT $1 OFFSET $2`;
//   // const val = [limit, offset];
//   db.query(`SELECT * FROM users WHERE email LIKE '%${keyword}%' ORDER BY id ASC LIMIT $1 OFFSET $2`, [limit, offset], (err, res)=>{
//     cb(res.rows);
//   });
// };

// experiment
exports.searchSortUsers = (column_name, keyword, sort_type, limit=parseInt(LIMIT_DATA), offset=0, cb)=>{
  // const q = `SELECT * FROM users ASC WHERE email LIKE \'%${keyword}%\' ORDER BY id LIMIT $1 OFFSET $2`;
  // const val = [limit, offset];
  db.query(`SELECT * FROM users WHERE ${column_name} LIKE '%${keyword}%' ORDER BY id ${sort_type} LIMIT $1 OFFSET $2`, [limit, offset], (err, res)=>{
    cb(res.rows);
  });
};

exports.countAllUsers= (keyword, cb)=>{
  db.query(`SELECT * FROM users WHERE email LIKE '%${keyword}%'`, (err, res)=>{
    cb(err, res.rowCount);
  });
};