import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";
import sql from "mssql";

export class DepartmentDAL {
  static async add(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), departament.name);

      await request.execute("AddDepartment");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async update(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, departament.idDepartment);
      request.input("name", sql.VarChar(30), departament.name);

      await request.execute("UpdateDepartment");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async delete(idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, idDepartment);

      await request.execute("DeleteDepartment");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async getDepartmentByName(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("DepartmentByName");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getDepartmentById(idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, idDepartment);

      const result = await request.execute("DepartmentById");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getDepartments() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllDepartments");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getDepartmentsOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("DepartmentsOffset");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
