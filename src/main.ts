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
function main() {
  console.log(logoText);
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
            'View all roles',
            'Add role',
            'View all departments',
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
                          choices: getRoleOptions
                        },
                        {
                          type: 'list',
                          name: 'manager',
                          message: 'Manager:',
                          choices: getEmployeeOptions
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
                    function getRoleOptions() {
                      return db.viewRoles().then((result) => {
                        return result.rows.map((role) => {
                          return {
                            name: role.title,
                            value: role.id
                          };
                        });
                      });
                    }
                    function getEmployeeOptions() {
                      return db.viewEmployees().then((result) => {
                        return result.rows.map((employee) => {
                          return {
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                          };
                        });
                      });
                    }
                    inquirer
                      .prompt([
                        {
                          name: 'employee_id',
                          type: 'list',
                          message: 'Employee:',
                          choices: getEmployeeOptions
                        },
                        
                        
                        {
                          name: 'role_id',
                          type: 'list',
                          message: 'Role:',
                          choices: getRoleOptions
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
                    function getDepartmentOptions() {
                      return db.viewDepartments().then((result) => {
                        return result.rows.map((department) => {
                          return {
                            name: department.name,
                            value: department.id
                          };
                        });
                      });
                    }
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
                          choices: getDepartmentOptions
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
                            choices: getDepartmentOptions
                          }
                        ])
                        .then((answers) => {
                          db.deleteDepartment(answers.name).then(() => {
                            console.log('Department deleted');
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

      

