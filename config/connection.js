const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employees_db'
    },
    console.log(`Connected to the courses_db database.`)
);

module.exports = db;