import sql from "mssql";
import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";

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

      await request.execute("AddNeighborhood");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async update(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idNeighborhood", sql.Int, neighbordhood.idNeighborhood);
      request.input("name", sql.VarChar(30), neighbordhood.name);
      request.input(
        "idDepartment",
        sql.Int,
        neighbordhood.department.idDepartment
      );

      await request.execute("UpdateNeighborhood");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async delete(idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      const result = await request.execute("DeleteNeighborhood");

      if (result.returnValue == -1)
        throw new Error("No hay un barrio registrado con este nombre", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar barrio", {
          cause: { code: 502 }
        });
      else if (result.returnValue == -3)
        throw new Error("Este registro ya ha sido eliminado por otro usuario", {
          cause: { code: 502 }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoods() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllNeighborhoods");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodByName(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("NeighborhoodByName");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodsOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("NeighborhoodsOffset");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodsByDepartment(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("AllNeighborhoodsByNameDepartment");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodsByDepartmentOffset(name, offset) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("name", sql.VarChar(30), name);
      request.input("offset", sql.Int, offset);

      const result = await request.execute(
        "NeighborhoodsByNameDepartmentOffset"
      );

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
