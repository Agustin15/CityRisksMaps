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

      switch (result.returnValue) {
        case -1:
          throw new Error("No hay registrado un barrio con este nombre", {
            cause: { code: 404 }
          });
        case -2:
          throw new Error("No hay registrado un crimen con esta categoria", {
            cause: { code: 404 }
          });
        case -3:
          throw new Error(
            "Ya hay registrado un crimen en este barrio en este año",
            {
              cause: { code: 409 }
            }
          );
        case -4:
          throw new Error("Cantidad de denuncias debe ser mayor a cero", {
            cause: { code: 400 }
          });

        case -5:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });

        case -5:
          throw new Error("Error inesperado al agregar crimen en barrio", {
            cause: { code: 502 }
          });
      }
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

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No hay registrado un crimen en este barrio y este año",
            {
              cause: { code: 404 }
            }
          );
        case -2:
          throw new Error("Cantidad de denuncias debe ser mayor a cero", {
            cause: { code: 400 }
          });
        case -3:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });

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

  async delete(neighborhoodCrime) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(10), neighborhoodCrime.propCrime);
      request.input(
        "neighborhood",
        sql.VarChar(30),
        neighborhoodCrime.propNeighborhood
      );
      request.input("year", sql.Int, neighborhoodCrime.propYear);

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
