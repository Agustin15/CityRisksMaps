import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";
import sql, { MAX } from "mssql";

export class ZoneDAL {
  static async add(zone) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("description", sql.VarChar(250), zone.description);
      request.input("coordinates", sql.VarChar(MAX), zone.coordinates);
      request.input("enable", sql.Bit, zone.enable);

      await request.execute("AddZone");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async update(zone) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, zone.idZone);
      request.input("description", sql.VarChar(250), zone.description);
      request.input("coordinates", sql.VarChar(MAX), zone.coordinates);
      request.input("enable", sql.Bit, zone.enable);

      await request.execute("UpdateZone");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }
  static async delete(idZone) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, idZone);

      await request.execute("DeleteZone");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async getAllZones() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllZones");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getZonesOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("zonesOffset");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getZonesById(idZone) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idZone", sql.Int, idZone);

      const result = await request.execute("ZoneById");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
