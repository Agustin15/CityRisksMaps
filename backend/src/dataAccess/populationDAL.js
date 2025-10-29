import { connection } from "../config/connection.js";
import sql from "mssql";

export class PopulationDAL {
  async add(neighborhoodName, quantity, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("neighbordhood", sql.VarChar(30), neighborhoodName);
      request.input("quantity", sql.Int, quantity);
      request.input("year", sql.Int, year);

      const result = await request.execute("AddPopulation");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const request = new sql.Request(connection.pool);

      const identCurrent = await request.execute(
        "SELECT IDENT_CURRENT('Population')"
      );

      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update(idPopulation, neighborhoodName, quantity, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, idPopulation);
      request.input("quantity", sql.Int, quantity);
      request.input("year", sql.Int, year);
      request.input("neighbordhood", sql.VarChar(30), neighborhoodName);

      const result = await request.execute("UpdatePopulation");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(idPopulation) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, idPopulation);

      const result = await request.execute("DeletePopulation");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationById(idPopulation) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("idPopulation", sql.Int);

      await ps.prepare(
        "select * from population where idPopulation=@idPopulation"
      );
      const result = await ps.execute({
        idPopulation: idPopulation
      });
      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationByNeighborhoodAndYear(neighborhoodName, year) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("neighborhood", sql.VarChar(30));
      ps.input("year", sql.Int);

      await ps.prepare(
        "select * from population where neighborhood=@neighborhood and year=@year"
      );
      const result = await ps.execute({
        neighborhood: neighborhoodName,
        year: year
      });

      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPopulations() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare("select * from population");

      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
