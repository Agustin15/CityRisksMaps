import { Department } from "../model/Department.js";
import { connection } from "../config/connection.js";
import sql from "mssql";

export class DepartmentDAL {
  async add(name) {
    try {
      const department = new Department();
      department.propName = name;

      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), department.propName);

      const result = await request.execute("AddDepartment");

      return result;
    } catch (error) {
      //   console.log("Error:", error.originalError.info.number);
      throw error;
    }
  }

  async update(id, name) {
    try {
      const department = new Department();
      department.propIdDepartment = id;
      department.propName = name;

      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, department.propIdDepartment);
      request.input("name", sql.VarChar(30), department.propName);

      const result = await request.execute("UpdateDepartment");

      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const department = new Department();
      department.propIdDepartment = id;

      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, department.propIdDepartment);

      const result = await request.execute("DeleteDepartment");

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentByName(name) {
    try {
      const department = new Department();
      department.propName = name;

      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from departments where name=@name");

      const result = await ps.execute({ name: department.propName });
      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getDepartments() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare("select * from  departments");

      const result = await ps.execute();
      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
