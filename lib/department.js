const mysql = require('mysql2');
const db = require('../config/connection');
const inquirer = require('../index.js');

class Department {
    constructor(name) {
        this.name = name;
    }
    addDepartmentSql(name) {
        const values = [[name]];
        db.query("INSERT INTO department (dept_name) VALUES ?", [values], function (err, results) {
            console.log(`The ${name} department has been added to the table.`);
            console.log(err);
        })
    }
}

module.exports = Department;