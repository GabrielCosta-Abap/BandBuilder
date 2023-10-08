
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BandBuilder',
    password: 'senha',
    port: 5432,
});

module.exports = { pool };
