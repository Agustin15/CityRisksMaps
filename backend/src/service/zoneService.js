import { ZoneDAL } from "../dataAccessLayer/zoneDAL.js";

export class ZoneService {
  static async add(zone) {
    try {
      if (!zone) throw new Error("Debe indicar una zona para agregar");
      await ZoneDAL.add(zone);
    } catch (error) {
      throw error;
    }
  }

  static async update(zone) {
    try {
      if (!zone) throw new Error("Debe indicar una zona para actualizar");
      await ZoneDAL.update(zone);
    } catch (error) {
      throw error;
    }
  }
  static async delete(idUser) {
    try {
      await ZoneDAL.delete(idUser);
    } catch (error) {
      throw error;
    }
  }

  static async getAllZones() {
    try {
      const result = await ZoneDAL.getAllZones();
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getZonesOffset(offset) {
    try {
      const result = await ZoneDAL.getZonesOffset(offset);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getZonesById(idZone) {
    try {
      const result = await ZoneDAL.getZonesById(idZone);

      if (result.length > 0) return result[0];
      else return null;
    } catch (error) {
      throw error;
    }
  }
}
