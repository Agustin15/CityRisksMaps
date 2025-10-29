import { connection } from "../config/connection.js";
import sql from "mssql";

export class NeighborhoodCrimeDAL {
  async add(nameNeighborhood, categoryCrime, quantity, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("neighborhood", sql.VarChar(30), nameNeighborhood);
      request.input("crime", sql.VarChar(10), categoryCrime);
      request.input("quantity", sql.Int, quantity);
      request.input("year", sql.Int, year);

      const result = await request.execute("AddNeighborhoodCrime");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const request = new sql.Request(connection.pool);

      const identCurrent = await request.execute(
        "SELECT IDENT_CURRENT('Neighborhoods_Crimes')"
      );

      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update(nameNeighborhood, categoryCrime, quantity, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("neighborhood", sql.VarChar(30), nameNeighborhood);
      request.input("crime", sql.VarChar(10), categoryCrime);
      request.input("quantity", sql.Int, quantity);
      request.input("year", sql.Int, year);

      const result = await request.execute("UpdateNeighborhoodCrime");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(nameNeighborhood, categoryCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(10), categoryCrime);
      request.input("neighborhood", sql.VarChar(30), nameNeighborhood);

      const result = await request.execute("DeleteNeighborhoodCrime");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getYearsNeighborhoodsCrime(categoryCrime) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      ps.input("crime", sql.VarChar(10));

      await ps.prepare(
        "select DISTINCT year from Neighborhoods_Crimes where crime=@crime ORDER BY year desc"
      );

      const result = await ps.execute({
        crime: categoryCrime
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodsCrimeByYear(categoryCrime, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(10), categoryCrime);
      request.input("year", sql.Int, year);

      const result = await request.execute("NeighborhoodsCrimeByYear");
      return result;
    } catch (error) {
      throw error;
    }
  }
}
