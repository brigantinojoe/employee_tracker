const inquirer = require("inquirer");
const mysql = require('mysql2');
const Department = require('./lib/department.js');
const Role = require('./lib/role.js');
const db = require('./config/connection.js');
const Employee = require("./lib/employee.js");

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
                                : response.options === "add an employee" ? addEmployee()
                                    : response.options === "update an employee role" ? updateEmployee()
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
            start_inquirer();
        }
        );
};

var dept_array = [];
var role_array = [];
var manager_array = [];

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
                choices: dept_array
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

const addEmployee = function () {
    clearInterval(interval_restart);
    getRoles();
    getManagers();
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the employee\'s first name?',
                name: "first"
            },
            {
                type: 'input',
                message: 'What is the employee\'s last name?',
                name: "last"
            },
            {
                type: 'list',
                message: 'What is the employee\'s role?',
                name: 'role',
                choices: role_array
            },
            {
                type: 'list',
                message: 'Who is the employee\'s manager?',
                name: 'manager',
                choices: manager_array
            }
        ])
        .then(async (response) => {
            const first = response.first;
            const last = response.last;
            const role = response.role;
            const manager = response.manager;
            const myRe = /[0-9]+/;
            const roleRe = myRe.exec(role);
            const managerRe = myRe.exec(manager);
            const final_role = Number(roleRe[0]);
            const final_manager = Number(managerRe[0]);
            const newEmployee = new Employee(first, last, final_role, final_manager);
            newEmployee.addEmployeeSql();
            start_inquirer();
        }
        );
};

const updateEmployee = function () {
    getRoles();
    getManagers();
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which employee\'s role would you like to update?',
                name: 'id',
                choices: manager_array
            },
            {
                type: 'list',
                message: 'Which role do you want to assign the selected employee?',
                name: 'role',
                choices: role_array
            }
        ])
        .then(async (response) => {
            const role = response.role;
            const employee = response.id;
            const myRe = /[0-9]+/;
            const roleRe = myRe.exec(role);
            const employeeRe = myRe.exec(employee);
            const final_role = Number(roleRe[0]);
            const final_employee = Number(employeeRe[0]);
            // Add function call to update row
            updateEmployeeSql(final_employee, final_role);
            start_inquirer();
        }
        );
};

function getDepartments() {
    dept_array = [];
    db.query(`SELECT * FROM department`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            dept_array.push(element.dept_name);
        }
        return dept_array;
    });
}

function getRoles() {
    role_array = [];
    db.query(`SELECT 
	CONCAT(role.id, '. ', role.title, ': ', department.dept_name) as full_name
    FROM
    employees_db.role as role
    LEFT JOIN employees_db.department as department
    ON role.department_id = department.id`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            role_array.push(element.full_name);
        }
        return role_array;
    });
}

function getManagers() {
    manager_array = [];
    db.query(`SELECT 
    CONCAT(id,'. ',first_name,' ',last_name) AS full_name
    FROM
    employees_db.employee`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            manager_array.push(element.full_name);
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

function updateEmployeeSql(id, role) {
    const values = [[id],[role]];
    db.query("UPDATE employee SET role_id = ?? WHERE id = ?", [values], function (err, results) {
        console.log(err);
    });
}