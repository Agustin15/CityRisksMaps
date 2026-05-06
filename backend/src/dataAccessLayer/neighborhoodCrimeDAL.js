import { connection } from "../config/connection.js";
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

      const result = await request.execute("AddNeighborhoodsCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error("No hay registro de un barrio con este nombre", {
            cause: { code: 404 }
          });
        case -2:
          throw new Error("No hay registro de un crimen con esta categoria", {
            cause: { code: 404 }
          });
        case -3:
          throw new Error("Cantidad de denuncias debe ser mayor a cero", {
            cause: { code: 400 }
          });

        case -4:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });

        case -5:
          throw new Error(
            "Ya existe un registro en el barrio,mes,año y crimen indicado",
            {
              cause: { code: 400 }
            }
          );

        case -6:
          throw new Error("Error inesperado al agregar crimenes en barrios", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
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

      const result = await request.execute("UpdateNeighborhoodsCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error("No hay registro de un barrio con este nombre", {
            cause: { code: 404 }
          });
        case -2:
          throw new Error("No hay registro de un crimen con esta categoria", {
            cause: { code: 404 }
          });
        case -3:
          throw new Error("Cantidad de denuncias debe ser mayor a cero", {
            cause: { code: 400 }
          });

        case -4:
          throw new Error("Año debe ser menor al año actual", {
            cause: { code: 400 }
          });

        case -5:
          throw new Error(
            "No existe un registro en con el barrio,mes,año y crimen indicado",
            {
              cause: { code: 404 }
            }
          );

        case -6:
          throw new Error(
            "Error inesperado al actualizar crimenes en barrios",
            {
              cause: { code: 502 }
            }
          );
      }
    } catch (error) {
      throw error;
    }
  }

  static async delete(category, idNeighborhood, month, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("crime", sql.VarChar(20), category);
      request.input("idNeighborhood", sql.Int, idNeighborhood);
      request.input("month", sql.Int, month);
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

  static async getAmountOfAnCrimeInYears(crime) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("crime", sql.VarChar(20), crime);
      const result = await request.execute("AmountOfAnCrimeInYears");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getAmountOfAnCrimeInNeighborhoodsByYear(crime, year) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("crime", sql.VarChar(20), crime);
      request.input("year", sql.Int, year);

      const result = await request.execute(
        "AmountOfAnCrimeInNeighborhoodsByYear"
      );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getAmountOfAnCrimeInNeighborhoodInYears(crime, idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("crime", sql.VarChar(20), crime);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      const result = await request.execute(
        "AmountOfAnCrimeInNeighborhoodInYears"
      );
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
      request.input("idNeighborhood", sql.Int, year);
      request.input("year", sql.Int, year);

      const result = await request.execute(
        "AmountOfDifferentsCrimesInNeighborhoodInYear"
      );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
