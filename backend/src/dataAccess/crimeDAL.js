import { connection } from "../config/connection.js";
import sql from "mssql";

export class CrimeDAL {
  async add(crime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), crime.propCategory);
      request.input("description", sql.VarChar(700), crime.propDescription);

      const result = await request.execute("AddCrime");

      if (result.returnValue == -1)
        throw new Error("Ya hay un crimen registrado con esta categoria", {
          cause: { code: 409 }
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

  async update(crime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), crime.propCategory);
      request.input("description", sql.VarChar(700), crime.propDescription);

      const result = await request.execute("UpdateCrime");

      if (result.returnValue == -1)
        throw new Error("No hay registrado un crimen con esta categoria", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al actualizar crimen", {
          cause: { code: 502 }
        });

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(crime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), crime.propCategory);

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

  async getCrimeByCategory(crime) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("category", sql.Int);

      await ps.prepare("select * from crimes where category=@category");
      const result = await ps.execute({
        category: crime.propCategory
      });

      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllTypeCrimes() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("GetAllTypeCrimes");

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCrimesTypeOptions() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("CrimesTypeOptions");

      return result;
    } catch (error) {
      throw error;
    }
  }
}
