const mysql = require('mysql2');
const db = require('../config/connection');
const inquirer = require('../index.js');

class Role {
    constructor(title, salary, department_name) {
        this.title = title;
        this.salary = salary;
        this.department_name = department_name;
    }
    addRoleSql(name, salary, department_id) {
        const values = [[name, salary, department_id]];
        db.query("INSERT INTO role (title, salary, department_id) VALUES ?", [values], function (err, results) {
            // console.log(`The ${name} role has been added to the table.`);
            // console.log(err);
        });
    }
}

module.exports = Role;