const mysql = require('mysql2');
const db = require('../config/connection');
const inquirer = require('../index.js');

class Employee {
    constructor(first, last, role_id, manager_id) {
        this.first = first;
        this.last = last;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
    addEmployeeSql() {
        const values = [[this.first, this.last, this.role_id, this.manager_id]];
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?", [values], function (err, results) {
            // console.log(`The ${name} role has been added to the table.`);
            // console.log(err);
        });
    }
}

module.exports = Employee;