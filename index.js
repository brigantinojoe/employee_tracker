const inquirer = require("inquirer");
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

const start_inquirer = function () {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: "options",
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
            }
        ])
        .then((response) => {
            response.options === "view all departments" ? department_table()
                : response.options === "view all roles" ? role_table()
                    : response.options === "view all employees" ? employee_table() : console.log("Nope");
        }
        );
    }

start_inquirer();

// View All Departments
const department_table = function () {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
    })
};

// View All Roles
const role_table = function () {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
    })
};

// View All Employees
const employee_table = function () {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
    })
};