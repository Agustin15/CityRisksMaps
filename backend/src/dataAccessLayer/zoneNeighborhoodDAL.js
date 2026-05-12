import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";
import sql from "mssql";

export class ZoneNeighborhoodDAL {
  static async add(idZone, idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, idZone);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      await request.execute("AddZoneNeighborhood");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async delete(idZone, idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, idZone);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      await request.execute("DeleteZoneNeighborhood");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
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
