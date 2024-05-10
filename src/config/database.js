require('dotenv').config();
const mysql = require('mysql2/promise');

const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// (async () => {
//     try {
//         const connection = await pool.getConnection();
//         await connection.query('SET time_zone = ?', [`${process.env.TIME_ZONE}`]);
//         connection.release();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

module.exports = pool;