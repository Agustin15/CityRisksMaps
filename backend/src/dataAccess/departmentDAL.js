import { connection } from "../config/connection.js";
import sql from "mssql";

export class DepartmentDAL {
  async add(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("AddDepartment");

      return result.returnValue;
    } catch (error) {
      //   console.log("Error:", error.originalError.info.number);
      throw error;
    }
  }
  async getIdentCurrentTable() {
    try {
      const request = new sql.Request(connection.pool);

      const identCurrent = await request.execute("SELECT IDENT_CURRENT('Departments')");

      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update(id, name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, id);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("UpdateDepartment");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, id);

      const result = await request.execute("DeleteDepartment");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentByName(name) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from departments where name=@name");

      const result = await ps.execute({ name: name });
      await ps.unprepare();

      return result;
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

      return result;
    } catch (error) {
      throw error;
    }
  }
}
