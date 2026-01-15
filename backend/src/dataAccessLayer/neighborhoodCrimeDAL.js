import { connection } from "../config/connection.js";
import sql from "mssql";

export class NeighborhoodCrimeDAL {
  static async add(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input(
        "neighborhood",
        sql.VarChar(30),
        neighborhoodCrime.neighborhood.name
      );
      request.input("crime", sql.VarChar(20), neighborhoodCrime.crime.category);
      request.input("quantity", sql.Int, neighborhoodCrime.quantity);
      request.input("year", sql.Int, neighborhoodCrime.year);

      const result = await request.execute("AddNeighborhoodCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error("Cantidad de denuncias debe ser mayor a cero", {
            cause: { code: 400 }
          });

        case -2:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });

        case -3:
          throw new Error("No hay registrado un barrio con este nombre", {
            cause: { code: 404 }
          });
        case -4:
          throw new Error("No hay registrado un crimen con esta categoria", {
            cause: { code: 404 }
          });
        case -5:
          throw new Error(
            "Ya hay registrado un crimen en este barrio en este año",
            {
              cause: { code: 409 }
            }
          );

        case -6:
          throw new Error("Error inesperado al agregar crimen en barrio", {
            cause: { code: 502 }
          });
      }
      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async update(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input(
        "neighborhood",
        sql.VarChar(30),
        neighborhoodCrime.neighborhood.name
      );

      request.input("crime", sql.VarChar(20), neighborhoodCrime.crime.category);
      request.input("quantity", sql.Int, neighborhoodCrime.quantity);
      request.input("year", sql.Int, neighborhoodCrime.year);

      const result = await request.execute("UpdateNeighborhoodCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error("Cantidad de denuncias debe ser mayor a cero", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });

        case -3:
          throw new Error(
            "No hay registrado un crimen en este barrio y este año",
            {
              cause: { code: 404 }
            }
          );

        case -4:
          throw new Error("Error inesperado al actualizar crimen en barrio", {
            cause: { code: 502 }
          });
      }

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async delete(category, nameNeighborhood, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(20), category);
      request.input("neighborhood", sql.VarChar(30), nameNeighborhood);
      request.input("year", sql.Int, year);

      const result = await request.execute("DeleteNeighborhoodCrime");

      if (result.returnValue == -1)
        throw new Error(
          "No hay registrado un crimen en este barrio y este año",
          {
            cause: { code: 404 }
          }
        );

      if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar crimen en barrio", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
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
  static async getCategoryCrimeInNeighborhood(category, nameNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("neighborhood", sql.VarChar(30), nameNeighborhood);
      request.input("crime", sql.VarChar(20), category);

      const result = await request.execute(
        "QuantityCategoryCrimeInNeighborhood"
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
