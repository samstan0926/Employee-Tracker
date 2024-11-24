//import inquirer from "inquirer";
import { pool } from "./connection.js";
export default class DB {
    constructor() {
        Object.defineProperty(this, "viewEmployees", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                return this.query(`SELECT employees.id AS employee_id, employees.first_name, employees.last_name, roles.title, roles.salary, department.name as department, 
    CONCAT(ee.first_name, ' ', ee.last_name) AS manager_name
    FROM employees 
    LEFT JOIN employees AS ee ON employees.manager_id = ee.id
    JOIN roles ON employees.roles_id = roles.id
    JOIN department ON roles.department_id = department.id`);
            }
        });
        Object.defineProperty(this, "addEmployee", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (first_name, last_name, role, manager) => {
                return this.query("INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES ($1, $2, $3, $4)", [first_name, last_name, role, manager]);
            }
        });
        Object.defineProperty(this, "updateEmployeeRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (role_id, employee_id) => {
                return this.query("UPDATE employees SET roles_id = $1 WHERE id = $2", [role_id, employee_id]);
            }
        });
        Object.defineProperty(this, "viewRoles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                return this.query("SELECT roles.id, roles.title, roles.salary, department.name as department FROM roles JOIN department ON roles.department_id = department.id");
            }
        });
        Object.defineProperty(this, "addRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (title, salary, department) => {
                return this.query("INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)", [title, salary, department]);
            }
        });
        Object.defineProperty(this, "viewDepartments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                return this.query("SELECT department.id, department.name FROM department;");
            }
        });
        Object.defineProperty(this, "addDepartment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (name) => {
                return this.query("INSERT INTO department (name) VALUES ($1)", [name]);
            }
        });
        Object.defineProperty(this, "deleteDepartment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (id) => {
                return this.query("DELETE FROM department WHERE id = $1", [id]);
            }
        });
        Object.defineProperty(this, "deleteRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (id) => {
                return this.query("DELETE FROM roles WHERE id = $1", [id]);
            }
        });
        Object.defineProperty(this, "deleteEmployee", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (id) => {
                return this.query("DELETE FROM employees WHERE id = $1", [id]);
            }
        });
        Object.defineProperty(this, "getEmployeeOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                const employees = await this.query("SELECT id, first_name, last_name FROM employees");
                return employees.rows.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }));
            }
        });
        Object.defineProperty(this, "getRoleOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                const roles = await this.query("SELECT id, title FROM roles");
                return roles.rows.map((role) => ({
                    name: role.title,
                    value: role.id
                }));
            }
        });
        Object.defineProperty(this, "getDepartmentOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                const departments = await this.query("SELECT id, name FROM department");
                return departments.rows.map((department) => ({
                    name: department.name,
                    value: department.id
                }));
            }
        });
    }
    ;
    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = client.query(sql, args);
            return result;
        }
        finally {
            client.release();
        }
    }
}
