import sql from "mssql";
import { connection } from "../config/connection.js";

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
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllNeighborhoods");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodByName(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("NeighborhoodByName");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
