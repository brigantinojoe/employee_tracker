const mysql = require('mysql2');
const db = require('../config/connection');
const inquirer = require('../index.js');

class Role {
    constructor(title, salary, department_name) {
        this.title = title;
        this.salary = salary;
        this.department_name = department_name;
    }
    getID(department_name) {
        const values = [[department_name]];
        db.query("SELECT id FROM department WHERE dept_name = ?", [values], function (err, results) {
            // console.log(err);
            console.log(results);
            this.id = results[0].id;
        });
    
    }
    addRoleSql(name, salary, department_id) {
        const values = [[name], [salary], [department_id]];
        db.query("INSERT INTO role (title, salary, department_id) VALUES ?", [values], function (err, results) {
            console.log(`The ${name} role has been added to the table.`);
            console.log(err);
        });
    }
}

module.exports = Role;