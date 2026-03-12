import { connection } from "../config/connection.js";
import sql, { MAX } from "mssql";

export class ZoneDAL {
  static async add(zone) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("description", sql.VarChar(250), zone.description);
      request.input("coordinates", sql.VarChar(MAX), zone.coordinates);
      request.input("enable", sql.Bit, zone.enable);

      const result = await request.execute("AddZone");

      switch (result.returnValue) {
        case -1:
          throw new Error("Descripcion no debe tener mas de 250 caracteres", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Habilitar debe ser verdadero o falso", {
            cause: { code: 400 }
          });

        case -3:
          throw new Error("Error inesperado al agregar zona", {
            cause: { code: 502 }
          });

        case -4:
          throw new Error("Error inesperado al agregar zona de barrio", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async update(zone) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, zone.idZone);
      request.input("description", sql.VarChar(250), zone.description);
      request.input("coordinates", sql.VarChar(MAX), zone.coordinates);
      request.input("enable", sql.Bit, zone.enable);

      const result = await request.execute("UpdateZone");

      switch (result.returnValue) {
        case -1:
          throw new Error("Descripcion no debe tener mas de 250 caracteres", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Habilitar debe ser verdadero o falso", {
            cause: { code: 400 }
          });

        case -3:
          throw new Error("No se encontro al zona indicada en el sistema", {
            cause: { code: 404 }
          });

        case -4:
          throw new Error("Error inesperado al actualizar zona", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }
  static async delete(idUser) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idZone", sql.Int, idUser);

      const result = await request.execute("DeleteZone");

      switch (result.returnValue) {
        case -1:
          throw new Error("No se encontro al zona indicada en el sistema", {
            cause: { code: 404 }
          });

        case -2:
          throw new Error("Error inesperado al eliminar zona", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async getAllZones() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllZones");

      result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getZonesOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("zonesOffset");

      result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getZonesById(idZone) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idZone", sql.Int, idZone);

      const result = await request.execute("ZoneById");

      result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
