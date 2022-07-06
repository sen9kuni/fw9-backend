const db = require('../helpers/db');
const {LIMIT_DATA} = process.env;

exports.getAllProfile = (cb) => {
  db.query('SELECT * FROM profile', (err, res)=>{
    cb(res.rows);
  });
};


exports.createProfile = (data, cb) =>{
  const q = 'INSERT INTO profile(fullname, phonenumber, balance, picture, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const val = [data.fullname, data.phonenumber, data.balance, data.picture, data.user_id];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res);
    }else{
      cb(err, res);
    }
  });
};

// base
// exports.updateProfile = (id, data, cb)=>{
//   const q = 'UPDATE profile SET fullname=$1, phonenumber=$2, balance=$3, picture=$4 WHERE id=$5 RETURNING *';
//   const val = [data.fullname, data.phonenumber, data.balance, data.picture, id];
//   db.query(q, val, (err, res)=>{
//     if (res) {
//       cb(err, res);
//     }else{
//       cb(err);
//     }
//   });
// };

// experiment
exports.updateProfile = (id, picture, cb)=>{
  const q = 'UPDATE profile SET picture= $1 WHERE id= $2 RETURNING *';
  const val = [picture, id];
  db.query(q, val, (err, res)=>{
    cb(err, res);
  });
};
// experiment

exports.deleteProfile = (id, cb)=>{
  const q = 'DELETE FROM profile WHERE id=$1 RETURNING *';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.getProfileById = (id, cb)=>{
  const q = 'SELECT * FROM profile WHERE id=$1';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};


exports.searchSortProfile = (searchBy, keyword, sort_by, sort_type, limit=parseInt(LIMIT_DATA), offset=0, cb)=>{
  db.query(`SELECT * FROM profile WHERE ${searchBy} LIKE '%${keyword}%' ORDER BY ${sort_by} ${sort_type} LIMIT $1 OFFSET $2`, [limit, offset], (err, res)=>{
    cb(res.rows);
  });
};

exports.countAllProfile = (keyword, cb)=>{
  db.query(`SELECT * FROM profile WHERE fullname LIKE '%${keyword}%'`, (err, res)=>{
    cb(err, res.rowCount);
  });
};