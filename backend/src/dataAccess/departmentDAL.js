import { connection } from "../config/connection.js";
import sql from "mssql";

export class DepartmentDAL {
  static async add(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), departament.name);

      const result = await request.execute("AddDepartment");

      if (result.returnValue == -1)
        throw new Error("Ya hay registrado un departmento con esta nombre", {
          cause: { code: 409 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al agregar departmento", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async update(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, departament.idDepartment);
      request.input("name", sql.VarChar(30), departament.name);

      const result = await request.execute("UpdateDepartment");

      if (result.returnValue == -1)
        throw new Error("Departmento con este ID no encontrado", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Ya hay registrado un departamento con este nombre", {
          cause: { code: 409 }
        });
      else if (result.returnValue == -3)
        throw new Error("Error inesperado al actualizar departamento", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async delete(idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int,idDepartment);

      const result = await request.execute("DeleteDepartment");
      if (result.returnValue == -1)
        throw new Error("Departmento con este ID no encontrado", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar departamento", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async getDepartmentByName(name) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from departments where name=@name");

      const result = await ps.execute({ name: name });
      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getDepartments() {
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
