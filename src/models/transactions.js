const db = require('../helpers/db');

exports.getAllTransactions = (cb) => {
  db.query('SELECT * FROM transactions', (err, res)=>{
    cb(res.rows);
  });
};

exports.createTransaction = (data, cb) => {
  const q = 'INSERT INTO transactions(amount, recipient_id, sender_id, note, time, type_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const val = [data.amount, data.recipient_id, data.sender_id, data.note, data.time, data.type_id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.deleteProfile = (id, cb)=>{
  const q = 'DELETE FROM transactions WHERE id=$1 RETURNING *';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.searchTransactionById = (id, cb)=>{
  const q = 'SELECT * FROM transactions WHERE id=$1';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};