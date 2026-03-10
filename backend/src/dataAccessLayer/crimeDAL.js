import { connection } from "../config/connection.js";
import sql from "mssql";

export class CrimeDAL {
  static async add(crime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(20), crime.category);
      request.input("description", sql.VarChar(700), crime.description);

      const result = await request.execute("AddCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error("Categoria no debe tener mas de 20 caracteres", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Descripcion no debe tener mas de 700 caracteres", {
            cause: { code: 400 }
          });
        case -3:
          throw new Error("Ya hay un crimen registrado con esta categoria", {
            cause: { code: 409 }
          });
        case -4:
          throw new Error("Error inesperado al agregar crimen", {
            cause: { code: 502 }
          });
      }

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async update(crime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(20), crime.category);
      request.input("description", sql.VarChar(700), crime.description);

      const result = await request.execute("UpdateCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error("Categoria no debe tener mas de 20 caracteres", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Descripcion no debe tener mas de 700 caracteres", {
            cause: { code: 400 }
          });
        case -3:
          throw new Error("No hay registrado un crimen con esta categoria", {
            cause: { code: 404 }
          });

        case -4:
          throw new Error("Error inesperado al actualizar crimen", {
            cause: { code: 502 }
          });
      }

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async delete(category) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(20), category);

      const result = await request.execute("DeleteCrime");

      if (result.returnValue == -1)
        throw new Error("No hay registrado un crimen con esta categoria", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al agregar crimen", {
          cause: { code: 502 }
        });

      result.returnValue;
    } catch (error) {
      throw error;
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

      const result = await request.execute("GetAllTypeCrimes");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getCrimesTypeOptions() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("CrimesTypeOptions");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
