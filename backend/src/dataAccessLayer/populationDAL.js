import { connection } from "../config/connection.js";
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

      const result = await request.execute("AddPopulation");

      switch (result.returnValue) {
        case -1:
          throw new Error("Cantidad de poblacion no debe ser menor a cero", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });
        case -3:
          throw new Error("No hay un barrio registrado con este nombre", {
            cause: { code: 404 }
          });
        case -4:
          throw new Error(
            "Ya existe una poblacion asociada a este barrio en este año",
            {
              cause: { code: 409 }
            }
          );

        case -5:
          throw new Error("Error inesperado al agregar poblacion", {
            cause: { code: 502 }
          });
      }

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async update(population) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, population.idPopulation);
      request.input("quantity", sql.Int, population.quantity);
      request.input("year", sql.Int, population.year);
      request.input(
        "neighbordhood",
        sql.VarChar(30),
        population.neighborhood.name
      );

      const result = await request.execute("UpdatePopulation");

      switch (result.returnValue) {
        case -1:
          throw new Error("Cantidad de poblacion no debe ser menor a cero", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });
        case -3:
          throw new Error("No hay registro de una poblacion con este ID", {
            cause: { code: 404 }
          });
        case -4:
          throw new Error("No hay registro de un barrio con nombre", {
            cause: { code: 404 }
          });

        case -5:
          throw new Error(
            "Ya hay registro de una poblacion con este barrio y este año",
            {
              cause: { code: 409 }
            }
          );
        case -6:
          throw new Error("Error inesperado al actualizar poblacion", {
            cause: { code: 502 }
          });
      }

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async delete(idPopulation) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idPopulation", sql.Int, idPopulation);

      const result = await request.execute("DeletePopulation");

      if (result.returnValue == -1) {
        throw new Error("No hay registro de una poblacion con este ID", {
          cause: { code: 404 }
        });
      }

      if (result.returnValue == -2) {
        throw new Error("Error inesperado al eliminar poblacion", {
          cause: { code: 502 }
        });
      }

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationById(idPopulation) {
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

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationByNeighborhoodAndYear(name, year) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("neighborhood", sql.VarChar(30));
      ps.input("year", sql.Int);

      await ps.prepare(
        "select * from population where neighborhood=@neighborhood and year=@year"
      );
      const result = await ps.execute({
        neighborhood: name,
        year: year
      });

      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulations() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare("select * from population");

      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
