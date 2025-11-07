import { connection } from "../config/connection.js";
import sql from "mssql";

export class NeighborhoodCrimeDAL {
  async add(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input(
        "neighborhood",
        sql.VarChar(30),
        neighborhoodCrime.propNeighborhood
      );
      request.input("crime", sql.VarChar(10), neighborhoodCrime.propCrime);
      request.input("quantity", sql.Int, neighborhoodCrime.propQuantity);
      request.input("year", sql.Int, neighborhoodCrime.propYear);

      const result = await request.execute("AddNeighborhoodCrime");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input(
        "neighborhood",
        sql.VarChar(30),
        neighborhoodCrime.propNeighborhood
      );
      request.input("crime", sql.VarChar(10), neighborhoodCrime.propCrime);
      request.input("quantity", sql.Int, neighborhoodCrime.propQuantity);
      request.input("year", sql.Int, neighborhoodCrime.propYear);

      const result = await request.execute("UpdateNeighborhoodCrime");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(10), neighborhoodCrime.propCrime);
      request.input(
        "neighborhood",
        sql.VarChar(30),
        neighborhoodCrime.propNeighborhood
      );

      const result = await request.execute("DeleteNeighborhoodCrime");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getYearsNeighborhoodsCrime(neighborhoodCrime) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      ps.input("crime", sql.VarChar(10));

      await ps.prepare(
        "select DISTINCT year from Neighborhoods_Crimes where crime=@crime ORDER BY year desc"
      );

      const result = await ps.execute({
        crime: neighborhoodCrime.propCrime
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodsCrimeByYear(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(10), neighborhoodCrime.propCrime);
      request.input("year", sql.Int, neighborhoodCrime.propYear);

      const result = await request.execute("NeighborhoodsCrimeByYear");
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getCategoryCrimeInNeighborhood(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input(
        "neighborhood",
        sql.VarChar(30),
        neighborhoodCrime.propNeighborhood
      );
      request.input("crime", sql.VarChar(10), neighborhoodCrime.propCrime);

      const result = await request.execute(
        "QuantityCategoryCrimeInNeighborhood"
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
