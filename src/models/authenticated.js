const db = require('../helpers/db');
const {LIMIT_DATA} = process.env;

exports.register = (data, cb)=> {
  db.query('BEGIN', err => {
    if (err){
      cb(err);
    } else {
      const q = 'INSERT INTO users(email, password, username) VALUES ($1, $2, $3) RETURNING id';
      const val =[data.email, data.password, data.username];
      db.query(q, val, (err, res) => {
        if (err){
          cb(err);
        } else {
          const insertprofile = 'INSERT INTO profile(user_id) VALUES ($1)';
          const insertprofileVal = [res.rows[0].id];
          db.query(insertprofile, insertprofileVal, (err, res) => {
            if (err){
              cb(err);
            }else {
              cb(err, res);
              db.query('COMMIT', err => {
                if (err) {
                  console.error('Error registrasion', err.stack);
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.trasfer = (sender_id, data, cb)=> {
  db.query('BEGIN', err => {
    if (err){
      cb(err);
    } else {
      const q = 'INSERT INTO transactions(amount, recipient_id, sender_id, note, time, type_id_trans) VALUES ($1, $2, $3, $4, $5, $6) RETURNING amount, recipient_id, sender_id, note, time, type_id_trans';
      const val =[data.amount, data.recipient_id, sender_id, data.note, data.time, data.type_id_trans];
      db.query(q, val, (err, res1) => {
        if (err){
          cb(err);
        } else {
          const updateProfileSender = 'UPDATE profile SET balance = balance - $1 WHERE user_id = $2';
          const valProfileSender = [data.amount, res1.rows[0].sender_id];
          db.query(updateProfileSender, valProfileSender, (err, res) => {
            if (err){
              cb(err);
            } else {
              const updateProfileRecv = 'UPDATE profile SET balance = balance + $1 WHERE user_id = $2';
              const valProfileRecv = [data.amount, data.recipient_id];
              db.query(updateProfileRecv, valProfileRecv, (err, res)=>{
                if (err){
                  cb(err);
                }else {
                  cb(err, res1);
                  db.query('COMMIT', err => {
                    if (err) {
                      console.error('Error trasfer', err.stack);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.historyTransactions = (id, searchBy, keyword, orderBy, sortType, limit=parseInt(LIMIT_DATA), offset=0, cb)=>{
  const q = `SELECT * FROM transactions WHERE recipient_id=${id} OR sender_id=${id} AND ${searchBy} LIKE '%${keyword}%' ORDER BY ${orderBy} ${sortType} LIMIT $1 OFFSET $2`;
  const val = [limit, offset];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res.rows);
    }else{
      cb(err);
    }
  });
};

exports.countHistoryTransactions = (id, searchBy, keyword, cb)=>{
  db.query(`SELECT * FROM transactions WHERE recipient_id=${id} OR sender_id=${id} AND ${searchBy} LIKE '%${keyword}%'`, (err, res)=>{
    cb(err, res.rowCount);
  });
};