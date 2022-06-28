const {Pool} = require('pg');

const {DATABASE_URL: connectionsString} = process.env;

const db = new Pool({
  connectionsString
});

module.exports = db;