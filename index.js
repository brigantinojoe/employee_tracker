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
    });
};

// View All Roles
const role_table = function () {
    db.query(`SELECT role.id, role.title, department.dept_name, role.salary 
    FROM employees_db.role 
    JOIN department 
    ON role.department_id = department.id`, function (err, results) {
        console.table(results);
    })
};

// View All Employees
const employee_table = function () {
    db.query( `
    SELECT 
        origin.id,
        origin.first_name,
        origin.last_name,
        new_role.title,
        department.dept_name,
        CONCAT(second.first_name, ' ', second.last_name) AS Manager
    FROM
        employees_db.employee as origin
        LEFT JOIN
        employees_db.role as new_role
        ON origin.role_id = new_role.id
        LEFT JOIN
        employees_db.department as department
        ON new_role.department_id = department.id
        LEFT JOIN
        employees_db.employee AS second ON origin.manager_id = second.id`, function (err, results) {
        console.table(results);
    })
};