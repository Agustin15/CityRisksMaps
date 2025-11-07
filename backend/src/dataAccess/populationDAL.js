import { connection } from "../config/connection.js";
import sql from "mssql";

export class PopulationDAL {
  async add(population) {
    try {
      const request = new sql.Request(connection.pool);

      request.input(
        "neighbordhood",
        sql.VarChar(30),
        population.propNeighborhood
      );
      request.input("quantity", sql.Int, population.propQuantity);
      request.input("year", sql.Int, population.propYear);

      const result = await request.execute("AddPopulation");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update(population) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, population.propIdPopulation);
      request.input("quantity", sql.Int, population.propQuantity);
      request.input("year", sql.Int, population.propYear);
      request.input(
        "neighbordhood",
        sql.VarChar(30),
        population.propNeighborhood
      );

      const result = await request.execute("UpdatePopulation");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(population) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, population.propIdPopulation);

      const result = await request.execute("DeletePopulation");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationById(population) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("idPopulation", sql.Int);

      await ps.prepare(
        "select * from population where idPopulation=@idPopulation"
      );
      const result = await ps.execute({
        idPopulation: population.propIdPopulation
      });
      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationByNeighborhoodAndYear(population) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("neighborhood", sql.VarChar(30));
      ps.input("year", sql.Int);

      await ps.prepare(
        "select * from population where neighborhood=@neighborhood and year=@year"
      );
      const result = await ps.execute({
        neighborhood: population.propNeighborhood,
        year: population.propYear
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
