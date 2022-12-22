const mysql = require('mysql2');
const db = require('../config/connection');
const inquirer = require('../index.js');

class Role {
    constructor(name) {
        this.name = name;
    }
    addRoleSql(name, salary, department) {
        const values = [[name], [salary], [department]];
        db.query("INSERT INTO role (title, salary, department_id) VALUES ?", [values], function (err, results) {
            console.log(`The ${name} role has been added to the table.`);
            console.log(err);
        })
    }
}

module.exports = Role;