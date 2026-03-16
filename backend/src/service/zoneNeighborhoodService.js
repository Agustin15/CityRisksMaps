import { ZoneNeighborhoodDAL } from "../dataAccessLayer/zoneNeighborhoodDAL.js";

export class ZoneNeighborhoodService {
  static async delete(idZone, neighborhood) {
    try {
      await ZoneNeighborhoodDAL.delete(idZone, neighborhood);
    } catch (error) {
      throw error;
    }
  }

  static async getZonesByNeighborhood(neighborhood) {
    try {
      const result =
        await ZoneNeighborhoodDAL.getZonesByNeighborhood(
          neighborhood
        );

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getNeighborhoodsInZone(idZone) {
    try {
      const result =
        await ZoneNeighborhoodDAL.getNeighborhoodsInZone(idZone);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
