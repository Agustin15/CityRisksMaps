import { connection } from "../config/connection.js";
import sql from "mssql";

export class DepartmentDAL {
  async add(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), departament.propName);

      const result = await request.execute("AddDepartment");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, departament.propIdDepartment);
      request.input("name", sql.VarChar(30), departament.propName);

      const result = await request.execute("UpdateDepartment");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, departament.propIdDepartment);

      const result = await request.execute("DeleteDepartment");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentByName(departament) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from departments where name=@name");

      const result = await ps.execute({ name: departament.propName });
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
