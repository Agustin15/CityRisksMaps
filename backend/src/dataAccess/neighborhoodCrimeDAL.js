import { connection } from "../config/connection.js";
import { NeighborhoodCrime } from "../model/neighborhoodCrime.js";
import sql from "mssql";

export class NeighborhoodCrimeDAL {
  async add(nameNeighborhood, categoryCrime, quantity, year) {
    try {
      const neighborhoodCrime = new NeighborhoodCrime();

      neighborhoodCrime.propCrime = categoryCrime;
      neighborhoodCrime.propNeighborhood = nameNeighborhood;
      neighborhoodCrime.propQuantity = quantity;
      neighborhoodCrime.propYear = year;

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

  async update(nameNeighborhood, categoryCrime, quantity, year) {
    try {
      const neighborhoodCrime = new NeighborhoodCrime();

      neighborhoodCrime.propCrime = categoryCrime;
      neighborhoodCrime.propNeighborhood = nameNeighborhood;
      neighborhoodCrime.propQuantity = quantity;
      neighborhoodCrime.propYear = year;

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

  async delete(nameNeighborhood, categoryCrime) {
    try {
      const neighborhoodCrime = new NeighborhoodCrime();

      neighborhoodCrime.propCrime = categoryCrime;
      neighborhoodCrime.propNeighborhood = nameNeighborhood;

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

  async getYearsNeighborhoodsCrime(categoryCrime) {
    try {
      const neighborhoodCrime = new NeighborhoodCrime();

      neighborhoodCrime.propCrime = categoryCrime;

      const ps = new sql.PreparedStatement(connection.pool);

      ps.input("crime", sql.VarChar(10));

      await ps.prepare(
        "select DISTINCT year from Neighborhoods N LEFT JOIN Neighborhoods_Crimes NC on N.name=NC.neighborhood where crime=@crime"
      );

      const result = await ps.execute({
        crime: neighborhoodCrime.propCrime
      });

      return result.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getNeighborhoodsCrimeByYear(categoryCrime, year) {
    try {
      const neighborhoodCrime = new NeighborhoodCrime();

      neighborhoodCrime.propCrime = categoryCrime;
      neighborhoodCrime.propYear = year;

      const ps = new sql.PreparedStatement(connection.pool);

      ps.input("crime", sql.VarChar(10));
      ps.input("year", sql.Int);

      await ps.prepare(
        "select * from Neighborhoods N LEFT JOIN Neighborhoods_Crimes NC on N.name=NC.neighborhood INNER JOIN Population P on P.neighborhood=NC.neighborhood where crime=@crime and NC.year=@year"
      );

      const result = await ps.execute({
        crime: neighborhoodCrime.propCrime,
        year: neighborhoodCrime.propYear
      });

      return result.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
