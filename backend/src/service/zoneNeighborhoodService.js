import { ZoneNeighborhoodDAL } from "../dataAccessLayer/zoneNeighborhoodDAL.js";

export class ZoneNeighborhoodService {
  static async delete(idZone, idNeighborhood) {
    try {
      await ZoneNeighborhoodDAL.delete(idZone, idNeighborhood);
    } catch (error) {
      throw error;
    }
  }

  static async getZonesByNeighborhood(idNeighborhood) {
    try {
      const result =
        await ZoneNeighborhoodDAL.getZonesByNeighborhood(idNeighborhood);

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getNeighborhoodsInZone(idZone) {
    try {
      const result = await ZoneNeighborhoodDAL.getNeighborhoodsInZone(idZone);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
