import { connection } from "../config/connection.js";
import sql from "mssql";

export class DepartmentDAL {
  async add(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), departament.propName);

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

  async update(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, departament.propIdDepartment);
      request.input("name", sql.VarChar(30), departament.propName);

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

  async delete(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, departament.propIdDepartment);

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
