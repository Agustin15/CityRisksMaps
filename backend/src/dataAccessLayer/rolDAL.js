import { getCodeHttpError } from "../httpCodeErrors.js";
import { connection } from "../config/connection.js";
import sql from "mssql";

export class RolDAL {
  static async add(rol) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("name", sql.VarChar(10), rol.name);

      await request.execute("AddRol");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async update(rol) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idRol", sql.Int, rol.idRol);
      request.input("name", sql.VarChar(10), rol.name);

      await request.execute("UpdateRol");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }
  static async delete(idRol) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idRol", sql.Int, idRol);

      const result = await request.execute("DeleteRol");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async getAllRols() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllRols");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getRolById(idRol) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idRol", sql.Int, idRol);
      const result = await request.execute("RolById");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getRolByName(rolName) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(10), rolName);
      const result = await request.execute("RolByName");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
