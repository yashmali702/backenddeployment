


import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({

  host: 'localhost',
  user: 'yash',
  password: 'jayendra5',
  database: 'B_C',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on('connection', (connection) => {
  console.log('Connected to MySQL');
});

pool.on('error', (error) => {
  console.error('MySQL Pool Error:', error);
});

export default pool;
