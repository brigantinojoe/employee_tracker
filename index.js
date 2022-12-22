const inquirer = require("inquirer");
const mysql = require('mysql2');
const Department = require('./lib/department.js');
const Role = require('./lib/role.js');
const db = require('./config/connection.js');

const interval_restart = function () { setInterval(start_inquirer, 5000); };

const start_inquirer = function () {
    clearInterval(interval_restart);
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
                    : response.options === "view all employees" ? employee_table()
                        : response.options === "add a department" ? addDepartment()
                            : response.options === "add a role" ? addRole()
                                : console.log("Nope");
        }
        );
};

start_inquirer();

// View All Departments
const department_table = function () {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
    });
    setTimeout(() => {
        start_inquirer();
    }, 1000);
};

// View All Roles
const role_table = function () {
    db.query(`SELECT role.id, role.title, department.dept_name, role.salary 
    FROM employees_db.role 
    JOIN department 
    ON role.department_id = department.id`, function (err, results) {
        console.table(results);
    });
    setTimeout(() => {
        start_inquirer();
    }, 1000);
};

// View All Employees
const employee_table = function () {
    db.query(`
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
    });
    setTimeout(() => {
        start_inquirer();
    }, 1000);
};

// Add department
const addDepartment = function () {
    clearInterval(interval_restart);
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What would you like to name the new department?',
                name: "department_name"
            }
        ])
        .then((response) => {
            const new_department = new Department(response.department_name);
            new_department.addDepartmentSql(response.department_name);
        }
        );
};

var role_array = [];

const addRole = function () {
    clearInterval(interval_restart);
    getDepartments();
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: "name"
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: "salary"
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'departments',
                choices: role_array
            }
        ])
        .then(async (response) => {
            // Use response to call addRoleSql function (name, salary, department_id)
            const name = response.name;
            const salary = response.salary;
            const department_name = response.departments;
            const newRole = new Role(name, salary, department_name);
            var idPromise = await getId(department_name);
            const department_id = idPromise[0][0].id;
            newRole.addRoleSql(name, salary, department_id);
            start_inquirer();
        }
        );
};

function getDepartments() {
    role_array = [];
    db.query(`SELECT * FROM department`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            role_array.push(element.dept_name);
        }
        return role_array;
    });
}

async function getId(department_name) {
    const values = [[department_name]];
    return await db.promise().query("SELECT id FROM department WHERE dept_name = ?", [values], function (err, results) {
        // console.log(err);
        console.log(results[0].id);
        return (results[0].id).valueOf();
    });
}