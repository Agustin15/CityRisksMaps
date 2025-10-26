import { connection } from "../config/connection.js";
import { Population } from "../model/population.js";
import sql from "mssql";

export class PopulationDAL {
  async add(neighborhoodName, quantity, year) {
    try {
      const population = new Population();
      population.propNeighborhood = neighborhoodName;
      population.propQuantity = quantity;
      population.propYear = year;

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

  async update(idPopulation, neighborhoodName, quantity, year) {
    try {
      const population = new Population();
      population.propIdPopulation = idPopulation;
      population.propNeighborhood = neighborhoodName;
      population.propQuantity = quantity;
      population.propYear = year;

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

  async delete(idPopulation) {
    try {
      const population = new Population();
      population.propIdPopulation = idPopulation;

      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, population.propIdPopulation);

      const result = await request.execute("DeletePopulation");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationById(idPopulation) {
    try {
      const population = new Population();
      population.propIdPopulation = idPopulation;

      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("idPopulation", sql.Int);

      await ps.prepare(
        "select * from population where idPopulation=@idPopulation"
      );
      const result = await ps.execute({
        idPopulation: population.propIdPopulation
      });
      await ps.unprepare();

      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationByNeighborhoodAndYear(neighborhoodName, year) {
    try {
      const population = new Population();
      population.propNeighborhood = neighborhoodName;
      population.propYear = year;

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

      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
      
    } catch (error) {
      throw error;
    }
  }

  async getPopulations() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare("select * from population");

      await ps.unprepare();

      result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
