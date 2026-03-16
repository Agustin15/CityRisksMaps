import { connection } from "../config/connection.js";
import sql from "mssql";

export class ZoneNeighborhoodDAL {
  static async delete(idZone, neighborhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, idZone);
      request.input("neighborhood", sql.VarChar(30), neighborhood);

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

  static async getZonesByNeighborhood(neighborhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("neighborhood", sql.VarChar(30), neighborhood);

      const result = await request.execute("ZonesByNeighborhood");

      result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getNeighborhoodsInZone(idZone) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idZone", sql.Int, idZone);

      const result = await request.execute("NeighborhoodInZone");

      result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
