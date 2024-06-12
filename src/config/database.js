require('dotenv').config();
const mysql = require('mysql2/promise');

const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// (async () => {
//     try {
//         const connection = await pool.getConnection();
//         const [rows, fields] = await connection.query('SELECT @@global.time_zone AS timezone');
//         connection.release();
//         console.log('Timezone:', rows[0].timezone);
//         console.log('Local Timezone:', `${new Date().getTimezoneOffset() ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset())/60 < 10 ? `0${Math.abs(new Date().getTimezoneOffset())/60}` : Math.abs(new Date().getTimezoneOffset())/60}:00`);
//
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

global.pool = pool;