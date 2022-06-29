const db = require('../helpers/db');

exports.getAllTransactionType = (cb) => {
  db.query('SELECT * FROM transaction_type', (err, res)=>{
    cb(res.rows);
  });
};