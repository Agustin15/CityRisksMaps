import sql from "mssql";
import { connection } from "../config/connection";

export class NeighborhoodDAL {
  static async add(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighbordhood.name);
      request.input(
        "idDepartment",
        sql.Int,
        neighbordhood.department.idDepartment
      );

      const result = await request.execute("AddNeighborhood");

      if (result.returnValue == -1)
        throw new Error("Ya hay un barrio registrado con este nombre", {
          cause: { code: 409 }
        });
      else if (result.returnValue == -2)
        throw new Error("No hay un departamento registrado con este ID", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -3)
        throw new Error("Error inesperado al agregar barrio", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async update(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighbordhood.name);
      request.input(
        "idDepartment",
        sql.Int,
        neighbordhood.department.idDepartment
      );

      const result = await request.execute("UpdateNeighborhood");

      if (result.returnValue == -1)
        throw new Error("No hay un departamento registrado con este ID", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al actualizar barrio", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async delete(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("DeleteNeighborhood");

      if (result.returnValue == -1)
        throw new Error("No hay un barrio registrado con este nombre", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar barrio", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoods() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare("select * from neighborhoods");

      const result = await ps.execute();
      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodByName(name) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from neighborhoods where name=@name");

      const result = await ps.execute({ name: name });
      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
