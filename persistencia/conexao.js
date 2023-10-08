
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'containers-us-west-134.railway.app',
  database: 'railway',
  password: '***********',
  port: 7248,
});

module.exports = { pool };