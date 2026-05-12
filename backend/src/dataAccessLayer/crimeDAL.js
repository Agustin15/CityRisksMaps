import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";
import sql from "mssql";

export class CrimeDAL {
  static async add(crime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(20), crime.category);
      request.input("description", sql.VarChar(700), crime.description);

      await request.execute("AddCrime");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async update(crime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(20), crime.category);
      request.input("description", sql.VarChar(700), crime.description);

      await request.execute("UpdateCrime");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async delete(category) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(20), category);

      await request.execute("DeleteCrime");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async getCrimeByCategory(category) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(20), category);

      const result = await request.execute("CrimeByCategory");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getAllTypeCrimes() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllCrimes");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
