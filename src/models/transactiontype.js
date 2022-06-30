const db = require('../helpers/db');

exports.getAllTransactionType = (cb) => {
  db.query('SELECT * FROM transaction_type', (err, res)=>{
    cb(res.rows);
  });
};

exports.createTransactionType = (data, cb) => {
  const q = 'INSERT INTO transaction_type(name, description) VALUES ($1, $2) RETURNING *';
  const val = [data.name, data.description];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res.rows);
    }else{
      cb(err);
    }
    // cb(res.rows);
  });
};

exports.updateTransactionType = (id, data, cb) => {
  const q = 'UPDATE transaction_type SET name=$1, description=$2 WHERE id=$3 RETURNING *';
  const val = [data.name, data.description, id];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res.rows);
    }else{
      cb(err);
    }
    // cb(res.rows);
  });
};

exports.deleteTransactionType = (id, cb)=> {
  const q = 'DELETE FROM transaction_type WHERE id=$1 RETURNING *';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};

exports.searchTransactionTypeById = (id, cb)=>{
  const q = 'SELECT * FROM transaction_type WHERE id=$1';
  const val = [id];
  db.query(q, val, (err, res)=>{
    cb(res.rows);
  });
};