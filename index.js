const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./config/connections.js');

db.connect((err) => {
    if (err) throw err;
    console.log("Your connection was succesfull, Check out the terminal for more!");
    homepage();
});

const homepage = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'homepage',
            message: 'What would you like to do?',
            choices: ["View All Departments", "View All Employees", 
            "View All Roles", "Add a Role", "Add a Department", 
            "Add an Employee", "Update an Employee Role"]
        }
    ])
        .then((answer) => {
            switch (answer.homepage) {
                case "View All Departments":
                    viewDepartment();
                    break;

                case "View All Employees":
                    viewEmployees();
                    break;
                
                case "View All Roles":
                    viewRoles();
                    break;

                case "Add a Role":
                    addRole();
                    break;

                case "Add a Department":
                    addDepartment();
                    break;

                case "Add an Employee":
                    addEmployee();
                    break;

                case "Update an Employee Role":
                    updateEmployee();
                    break;

                default:
                    break;
            }
        })
};

function viewDepartment() {
    db.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        console.table(res);
        homepage();
    })
};

function viewEmployees() {
    db.query("SELECT * FROM employees", (err, res) => {
        if (err) throw err;
        console.table(res);
        homepage();
    })
};

function viewRoles() {
    db.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        console.table(res);
        homepage();
    })
};

function addRole() {
    db.query("SELECT id, name FROM  departments", (err, department) => {
        inquirer.prompt ([
            {
                type: 'input',
                name: 'role_title',
                message: 'What role would you like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is their salary?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What is the department id for this role?',
                choices: department.map(i => ({name: i.name, value: i.id}))
            }
        ])
            .then((answer) => {
                db.query("INSERT INTO roles (role_title, salary, department_id) VALUES (?,?,?)", 
                [answer.role_title, answer.salary, answer.department_id], (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    homepage();
                });
            });
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Name the department you would like to add'
        }
    ])
        .then((answer) => {
            db.query("INSERT INTO departments (name) VALUES (?)", answer.name, (err, res) => {
                if (err) throw err;
                console.table(res);
                homepage();
            })
        })
};

function addEmployee() {
    db.query("SELECT id, role_title FROM roles", (err, role) => {
        db.query("SELECT id, last_name FROM employees", (err, employee) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'First name of employee?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Last name of employee?'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the employee role id?',
                    choices: role.map(i => ({name: i.role_title, value: i.id}))
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'What is the manager id for the new employee',
                    choices: employee.map(i => ({name: i.first_name, value: i.id}))
                }
            ])
                .then((answer) => {
                    db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", 
                    [answer.first_name, answer.last_name, answer.role_id, answer.manager], (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        homepage();
                    });
                });
        });
    });
};

function updateEmployee() {
    db.query("SELECT id, first_name FROM employees", (err, employees) => {
        db.query("SELECT id, role_title FROM roles", (err, roles) => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employees',
                    message: 'What employee do you want to update?',
                    choices: employees.map(i => ({name: i.first_name, value: i.id}))
                },
                {
                    type: 'list',
                    name: 'roles',
                    message: 'Change employees role?',
                    choices: roles.map(i => ({name: i.role_title, value: i.id}))
                }
            ])
                .then((answer) => {
                    db.query("UPDATE employees SET role_id = '?' WHERE 'id' = '?' ", 
                    [answer.roles.id, answer.employees], (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        homepage();
                    });
                });
        });
    });
};