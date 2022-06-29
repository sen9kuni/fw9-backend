const db = require('../helpers/db');

exports.getAllProfile = (cb) => {
  db.query('SELECT * FROM profile', (err, res)=>{
    cb(res.rows);
  });
};


exports.createProfile = (data, cb) =>{
  const q = 'INSERT INTO profile(fullname, phonenumber, balance, picture, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const val = [data.fullname, data.phonenumber, data.balance, data.picture, data.user_id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.updateProfile = (id, data, cb)=>{
  const q = 'UPDATE profile SET fullname=$1, phonenumber=$2, balance=$3, picture=$4 WHERE id=$5 RETURNING *';
  const val = [data.fullname, data.phonenumber, data.balance, data.picture, id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.deleteProfile = (id, cb)=>{
  const q = 'DELETE FROM profile WHERE id=$1 RETURNING *';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.searchProfileById = (id, cb)=>{
  const q = 'SELECT * FROM profile WHERE id=$1';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};