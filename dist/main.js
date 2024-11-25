import DB from './index.js';
import inquirer from 'inquirer';
const db = new DB();
import logo from 'asciiart-logo';
const logoText = logo({
    name: 'Employee Tracker',
    font: 'Doom',
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: 'grey',
    logoColor: 'bold-green',
    textColor: 'green',
}).render();
console.log(logoText);
function main() {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add employee',
                'Update employee role',
                'Delete employee',
                'View all roles',
                'Add role',
                'View all departments',
                "Delete role",
                'Add department',
                'Delete department',
                'Quit'
            ]
        }
    ])
        .then((answers) => {
        switch (answers.action) {
            case 'View all employees':
                db.viewEmployees().then((result) => {
                    console.table(result.rows);
                    main();
                });
                break;
            case 'Add employee':
                inquirer
                    .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'First name:'
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Last name:'
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Role:',
                        choices: db.getRoleOptions
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Manager:',
                        choices: db.getEmployeeOptions,
                    }
                ])
                    .then((answers) => {
                    db.addEmployee(answers.first_name, answers.last_name, answers.role, answers.manager).then(() => {
                        console.log('Employee added');
                        main();
                    });
                });
                break;
            case 'Update employee role':
                inquirer
                    .prompt([
                    {
                        name: 'employee_id',
                        type: 'list',
                        message: 'Employee:',
                        choices: db.getEmployeeOptions
                    },
                    {
                        name: 'role_id',
                        type: 'list',
                        message: 'Role:',
                        choices: db.getRoleOptions
                    },
                ])
                    .then((answers) => {
                    db.updateEmployeeRole(answers.role_id, answers.employee_id).then(() => {
                        console.log('Employee role updated');
                        main();
                    });
                });
                break;
            case 'View all roles':
                db.viewRoles().then((result) => {
                    console.table(result.rows);
                    main();
                });
                break;
            case 'Add role':
                inquirer
                    .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Title:'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Salary:'
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'Department:',
                        choices: db.getDepartmentOptions
                    }
                ])
                    .then((answers) => {
                    db.addRole(answers.title, answers.salary, answers.department_id).then(() => {
                        console.log('Role added');
                        main();
                    });
                });
                break;
            case 'View all departments':
                db.viewDepartments().then((result) => {
                    console.table(result.rows);
                    main();
                });
                break;
            case 'Add department':
                inquirer
                    .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Department name:'
                    }
                ])
                    .then((answers) => {
                    db.addDepartment(answers.name).then(() => {
                        console.log('Department added');
                        main();
                    });
                });
                break;
            case 'Delete department':
                inquirer
                    .prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: 'Department name:',
                        choices: db.getDepartmentOptions
                    }
                ])
                    .then((answers) => {
                    db.deleteDepartment(answers.name).then(() => {
                        console.log('Department deleted');
                        main();
                    });
                });
                break;
            case 'Delete employee':
                inquirer
                    .prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: 'Employee name:',
                        choices: db.getEmployeeOptions
                    }
                ])
                    .then((answers) => {
                    db.deleteEmployee(answers.name).then(() => {
                        console.log('Employee deleted');
                        main();
                    });
                });
                break;
            case 'Delete role':
                inquirer
                    .prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: 'Role name:',
                        choices: db.getRoleOptions
                    }
                ])
                    .then((answers) => {
                    db.deleteRole(answers.name).then(() => {
                        console.log('Role deleted');
                        main();
                    });
                });
                break;
            case 'Quit':
                console.log('Goodbye!');
                process.exit();
        }
    });
}
main();
