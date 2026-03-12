import { ZoneNeighborhoodDAL } from "../dataAccessLayer/zoneNeighborhoodDAL.js";

export class ZoneNeighborhoodService {
  static async delete(idZone, neighborhood) {
    try {
      await ZoneNeighborhoodDAL.delete(idZone, neighborhood);
    } catch (error) {
      throw error;
    }
  }

  static async getZonesNeighborhoodByNeighborhood(neighborhood) {
    try {
      const result =
        await ZoneNeighborhoodDAL.getZonesNeighborhoodByNeighborhood(
          neighborhood
        );

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getZonesNeighborhoodByZone(idZone) {
    try {
      const result =
        await ZoneNeighborhoodDAL.getZonesNeighborhoodByZone(idZone);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
