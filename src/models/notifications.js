const db = require('../helpers/db');
// const {LIMIT_DATA} = process.env;

exports.createToken = (token, cb)=> {
  const q = 'INSERT INTO fcm_token(token) VALUES ($1) RETURNING *';
  const val = [token];
  db.query(q, val, (err, res)=> {
    if (res) {
      cb(err, res.rows[0]);
    } else {
      cb(err);
    }
  });
};

exports.updateUserToken = (user_id, token, cb)=> {
  const q = 'UPDATE fcm_token SET user_id=$1 WHERE token=$2';
  const val = [user_id, token];
  db.query(q, val, (err, res)=> {
    if (res) {
      cb(err, res);
    } else {
      cb(err);
    }
  });
};

exports.deleteUserToken = (token, cb)=> {
  const q = 'UPDATE fcm_token SET user_id = NULL WHERE token=$1';
  const val = [token];
  db.query(q, val, (err, res)=> {
    if (res) {
      cb(err, res);
    } else {
      cb(err);
    }
  });
};

exports.getDataByToken = (token, cb) => {
  const q = 'SELECT * FROM fcm_token WHERE token=$1';
  const val = [token];
  db.query(q, val, (err, res)=> {
    cb(err, res);
  });
};