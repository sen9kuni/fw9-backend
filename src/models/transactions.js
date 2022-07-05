const db = require('../helpers/db');

exports.getAllTransactions = (cb) => {
  db.query('SELECT * FROM transactions ORDER BY id ASC', (err, res)=>{
    cb(res.rows);
  });
};

// exports.getAllTransactions = (cb) => {
//   const q = 'SELECT amount, recipient_id, sender_id, note, time, type_id FROM transactions';
//   db.query(q, (err, res)=>{
//     console.log(err);
//     cb(res.rows);
//   });
// };

exports.createTransaction = (data, cb) => {
  const q = 'INSERT INTO transactions(amount, recipient_id, sender_id, note, time, type_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const val = [data.amount, data.recipient_id, data.sender_id, data.note, data.time, data.type_id];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res);
    }else{
      cb(err);
    }
  });
};

exports.updateTransaction = (id, data, cb) => {
  const q = 'UPDATE transactions SET amount=$1, recipient_id=$2, sender_id=$3, note=$4, time=$5, type_id=$6 WHERE id=$7 RETURNING *';
  const val = [data.amount, data.recipient_id, data.sender_id, data.note, data.time, data.type_id, id];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res.rows);
    }else{
      cb(err);
    }
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