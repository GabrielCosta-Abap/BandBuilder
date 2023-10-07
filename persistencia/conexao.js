const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BandBuilder',
    password: 'Hardc0re.',
    port: 5432,
});

module.exports = { pool };