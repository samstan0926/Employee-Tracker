//import inquirer from "inquirer";
import { pool } from "./connection.js";
import { QueryResult } from "pg";

export default class DB {
  constructor() {};


  async query(sql: string, args: any[] = []): Promise<QueryResult> {
    const client = await pool.connect();
   try{
    const result = client.query(sql, args);
    return result;
   } finally{
    client.release();
   }
  }





viewEmployees = async () => {

  return this.query(
    `SELECT employees.id AS employee_id, employees.first_name, employees.last_name, roles.title, roles.salary, department.name as department, 
    CONCAT(ee.first_name, ' ', ee.last_name) AS manager_name
    FROM employees 
    LEFT JOIN employees AS ee ON employees.manager_id = ee.id
    JOIN roles ON employees.roles_id = roles.id
    JOIN department ON roles.department_id = department.id`
  );
    


}
addEmployee = async (first_name: string, last_name: string, role: string, manager: string) => {
  return this.query(
    "INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES ($1, $2, $3, $4)",
    [first_name, last_name, role, manager]
  );

}
updateEmployeeRole = async (role_id: number, employee_id: number ) => {
    return this.query(
      "UPDATE employees SET roles_id = $1 WHERE id = $2",
      [role_id, employee_id]
    );

    
}
viewRoles = async () => {
  
    return this.query(
      "SELECT roles.id, roles.title, roles.salary, department.name as department FROM roles JOIN department ON roles.department_id = department.id"
    );

}
addRole = async (title: string, salary: string, department: string) => {
  return this.query(
    "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
    [title, salary, department]
  );

}
viewDepartments = async () => {
    
    return this.query(
      "SELECT department.id, department.name FROM department;"
    );
}
addDepartment = async (name: string) => {
  return this.query( "INSERT INTO department (name) VALUES ($1)", [name]);
 
}  
deleteDepartment = async (id: number) => {
  return this.query("DELETE FROM department WHERE id = $1", [id]);
}

deleteRole = async (id: number) => {
  return this.query("DELETE FROM roles WHERE id = $1", [id]);
}
deleteEmployee = async (id: number) => {
  return this.query("DELETE FROM employees WHERE id = $1", [id]);
}
getEmployeeOptions = async () => {
  const employees = await this.query("SELECT id, first_name, last_name FROM employees");
  return employees.rows.map((employee: { id: any; first_name: any; last_name: any; }) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));
}
getRoleOptions = async () => {
  const roles = await this.query("SELECT id, title FROM roles");
  return roles.rows.map((role: { id: any; title: any; }) => ({
    name: role.title,
    value: role.id
  }));

}

getDepartmentOptions = async () => {
  const departments = await this.query("SELECT id, name FROM department");
  return departments.rows.map((department: { id: any; name: any; }) => ({
    name: department.name,
    value: department.id
  }));
}
}