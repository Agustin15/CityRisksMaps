import { connection } from "../config/connection.js";
import sql from "mssql";

export class AuditoryNeighborhoodCrimeDal {
  static async getDatesOfAuditoryNeighborhoodsCrimes() {
    try {
      const request = new sql.Request(connection);
      const results = await request.execute(
        "DatesOfAuditoryNeighborhoodsCrimes"
      );
      return results.recordsets;
    } catch (error) {
      throw error;
    }
  }

  static async getAuditoryNeighborhoodsCrimesByDate(datetime) {
    try {
      const request = new sql.Request(connection);
      request.input("datetime", sql.Date, datetime);

      const results = await request.execute(
        "AuditoryNeighborhoodsCrimesByDate"
      );

      return results.recordsets;
    } catch (error) {
      throw error;
    }
  }

  static async getAuditoryNeighborhoodsCrimesOffsetByDate(datetime, offset) {
    try {
      const request = new sql.Request(connection);
      request.input("datetime", sql.Date, datetime);
      request.input("offset", sql.Int, offset);

      const results = await request.execute(
        "AuditoryNeighborhoodsCrimesOffsetByDate"
      );

      return results.recordsets;
    } catch (error) {
      throw error;
    }
  }
}
