import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";
import sql from "mssql";

export class NeighborhoodCrimeDAL {
  static async addThroughtTable(neighborhoodsCrime, categoryCrime, year) {
    try {
      const request = new sql.Request(connection.pool);

      const table = new sql.Table("NeighborhoodsCrimeTableType");

      table.columns.add("idNeighborhood", sql.Int);
      table.columns.add("crime", sql.VarChar(30));
      table.columns.add("quantity", sql.Int);
      table.columns.add("year", sql.Int);

      neighborhoodsCrime.forEach((neighborhoodCrime) => {
        table.rows.add(
          neighborhoodCrime.idNeighborhood,
          categoryCrime,
          neighborhoodCrime.amount,
          year
        );
      });

      request.input("table", sql.TVP, table);
      request.input("categoryCrime", sql.VarChar(30), categoryCrime);
      request.input("year", sql.Int, year);

      await request.execute("AddNeighborhoodsCrime");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async updateThroughtTable(neighborhoodsCrime, categoryCrime, year) {
    try {
      const request = new sql.Request(connection.pool);

      const table = new sql.Table("NeighborhoodsCrimeTableType");

      table.columns.add("idNeighborhood", sql.Int);
      table.columns.add("crime", sql.VarChar(30));
      table.columns.add("quantity", sql.Int);
      table.columns.add("year", sql.Int);

      neighborhoodsCrime.forEach((neighborhoodCrime) => {
        table.rows.add(
          neighborhoodCrime.idNeighborhood,
          categoryCrime,
          neighborhoodCrime.amount,
          year
        );
      });

      request.input("table", sql.TVP, table);
      request.input("categoryCrime", sql.VarChar(30), categoryCrime);
      request.input("year", sql.Int, year);

      await request.execute("UpdateNeighborhoodsCrime");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async delete(category, idNeighborhood, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(20), category);
      request.input("idNeighborhood", sql.Int, idNeighborhood);
      request.input("year", sql.Int, year);

      await request.execute("DeleteNeighborhoodCrime");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async getYearsNeighborhoodsCrime(category) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(20), category);

      const result = await request.execute("YearsNeighborhoodsCrime");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodsCrimeByYear(category, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(20), category);
      request.input("year", sql.Int, year);

      const result = await request.execute("NeighborhoodsCrimeByYear");
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getCategoryCrimeInNeighborhood(category, idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idNeighborhood", sql.Int, idNeighborhood);
      request.input("crime", sql.VarChar(20), category);

      const result = await request.execute(
        "QuantityCategoryCrimeInNeighborhood"
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodsCrimeByYearSecondVersion(category, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(20), category);
      request.input("year", sql.Int, year);

      const result = await request.execute(
        "NeighborhoodsCrimeByYearSecondVersion"
      );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getNeighborhoodsCrimeByYearOffset(category, year, offset) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(20), category);
      request.input("year", sql.Int, year);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("NeighborhoodsCrimeByYearOffset");
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getAmountAnCrimeInNeighborhoodByYear(
    crime,
    year,
    idNeighborhood
  ) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idNeighborhood", sql.Int, idNeighborhood);
      request.input("crime", sql.VarChar(20), crime);
      request.input("year", sql.Int, year);

      const result = await request.execute(
        "AmountOfAnCrimeInNeighborhoodByYear"
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getIncreaseOfCrimeInYears(crime) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("crime", sql.VarChar(20), crime);
      const result = await request.execute("IncreaseOfOneCrimeInYears");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getIncreaseOfCrimeInNeighborhood(crime, idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("crime", sql.VarChar(20), crime);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      const result = await request.execute(
        "IncreaseOfOneCrimeOfInNeighborhood"
      );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getAllYearsOfCrimes() {
    try {
      const request = new sql.Request(connection.pool);
      const result = await request.execute("AllYearsOfCrimes");
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getAmountOfDifferentsCrimesInNeighborhoodInYear(
    idNeighborhood,
    year
  ) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idNeighborhood", sql.Int, idNeighborhood);
      request.input("year", sql.Int, year);

      const result = await request.execute(
        "AmountOfDifferentsCrimesInNeighborhoodInYear"
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getAmountOfAnCrimeInNeighborhoodsByYear(crime, year, offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("crime", sql.VarChar(20), crime);
      request.input("year", sql.Int, year);
      request.input("offset", sql.Int, offset);

      const result = await request.execute(
        "AmountOfAnCrimeInNeighborhoodsByYear"
      );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
