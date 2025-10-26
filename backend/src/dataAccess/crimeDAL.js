import { connection } from "../config/connection.js";
import { Crime } from "../model/crime.js";
import sql from "mssql";

export class CrimeDAL {
  async add(category, description) {
    try {
      const crime = new Crime();
      crime.propCategory = category;
      crime.propDescription = description;

      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), crime.propCategory);
      request.input("description", sql.VarChar(700), crime.propDescription);

      const result = await request.execute("AddCrime");

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update(category, description) {
    try {
      const crime = new Crime();
      crime.propCategory = category;
      crime.propDescription = description;

      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), crime.propCategory);
      request.input("description", sql.VarChar(700), crime.propDescription);

      const result = await request.execute("UpdateCrime");

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(category) {
    try {
      const crime = new Crime();
      crime.propCategory = category;

      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), crime.propCategory);

      const result = await request.execute("DeleteCrime");

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getCrimeByCategory(category) {
    try {
      const crime = new Crime();
      crime.propCategory = category;

      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("category", sql.Int);

      await ps.prepare("select * from crimes where category=@category");
      const result = await ps.execute({
        category: crime.propCategory
      });

      await ps.unprepare();

      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getCrimes() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare("select * from crimes");

      const result = await ps.execute();
      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
