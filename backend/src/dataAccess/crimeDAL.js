import { connection } from "../config/connection.js";
import sql from "mssql";

export class CrimeDAL {
  async add(category, description) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), category);
      request.input("description", sql.VarChar(700), description);

      const result = await request.execute("AddCrime");

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const request = new sql.Request(connection.pool);

      const identCurrent = await request.execute(
        "SELECT IDENT_CURRENT('Crimes')"
      );

      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update(category, description) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), category);
      request.input("description", sql.VarChar(700), description);

      const result = await request.execute("UpdateCrime");

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(category) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("category", sql.VarChar(10), category);

      const result = await request.execute("DeleteCrime");

      result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getCrimeByCategory(category) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("category", sql.Int);

      await ps.prepare("select * from crimes where category=@category");
      const result = await ps.execute({
        category: category
      });

      await ps.unprepare();

      return result;
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

      return result;
    } catch (error) {
      throw error;
    }
  }
}
