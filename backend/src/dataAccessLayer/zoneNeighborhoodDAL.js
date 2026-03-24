import { connection } from "../config/connection.js";
import sql from "mssql";

export class ZoneNeighborhoodDAL {
  static async add(idZone, idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, idZone);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      const result = await request.execute("AddZoneNeighborhood");

      switch (result.returnValue) {
        case -1:
          throw new Error("No se encontro esta barrio en el sistema", {
            cause: { code: 404 }
          });
        case -2:
          throw new Error("No se encontro esta zona en el sistema", {
            cause: { code: 404 }
          });

        case -2:
          throw new Error(
            "Ya existe un registro de este barrio en esta zona" +
              " en el sistema",
            {
              cause: { code: 409 }
            }
          );

        case -4:
          throw new Error("Error inesperado al agregar zona de barrio", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async delete(idZone, idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, idZone);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      const result = await request.execute("DeleteZoneNeighborhood");

      switch (result.returnValue) {
        case -1:
          throw new Error("No se encontro esta zona de barrio en el sistema", {
            cause: { code: 404 }
          });
        case -2:
          throw new Error("Error inesperado al eliminar zona de barrio", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async getZonesByNeighborhood(idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      const result = await request.execute("ZonesByNeighborhood");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getNeighborhoodsInZone(idZone) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idZone", sql.Int, idZone);

      const result = await request.execute("NeighborhoodInZone");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
