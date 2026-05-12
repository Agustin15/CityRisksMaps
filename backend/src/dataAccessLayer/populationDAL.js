import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";
import sql from "mssql";

export class PopulationDAL {
  static async add(population) {
    try {
      const request = new sql.Request(connection.pool);

      request.input(
        "neighbordhood",
        sql.VarChar(30),
        population.neighborhood.name
      );
      request.input("quantity", sql.Int, population.quantity);
      request.input("year", sql.Int, population.year);

      await request.execute("AddPopulation");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async update(population) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, population.idPopulation);
      request.input("quantity", sql.Int, population.quantity);
      request.input("year", sql.Int, population.year);
      request.input(
        "neighborhood",
        sql.VarChar(30),
        population.neighborhood.name
      );

      await request.execute("UpdatePopulation");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async delete(idPopulation) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, idPopulation);

      await request.execute("DeletePopulation");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async getPopulationById(idPopulation) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, idPopulation);

      const result = await request.execute("PopulationById");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationByNeighborhoodAndYear(idNeighborhood, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idNeighborhood", sql.Int, idNeighborhood);
      request.input("year", sql.Int, year);

      const result = await request.execute("PopulationByNeighborhoodAndYear");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulations() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllPopulations");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsYears() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("PopulationsYears");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsByYear(year) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("year", sql.Int, year);

      const result = await request.execute("AllPopulationsByYear");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsOffsetByYear(offset, year) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);
      request.input("year", sql.Int, year);

      const result = await request.execute("PopulationsOffsetByYear");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsByNameNeighborhood(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("PopulationsByNameNeighborhood");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsOffsetByNameNeighborhood(name, offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);
      request.input("offset", sql.Int, offset);

      const result = await request.execute(
        "PopulationsOffsetByNameNeighborhood"
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
