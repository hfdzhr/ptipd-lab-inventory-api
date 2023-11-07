const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+07:00'
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;
