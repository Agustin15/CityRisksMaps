import { AuditoryNeighborhoodCrimeDal } from "../dataAccessLayer/auditoryNeighborhoodCrimeDal.js";

export class AuditoryNeighborhoodCrimeService {
  static async getDatesOfAuditoryNeighborhoodsCrimes() {
    try {
      const result =
        await AuditoryNeighborhoodCrimeDal.getDatesOfAuditoryNeighborhoodsCrimes();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAuditoryNeighborhoodsCrimesByDate(datetime) {
    try {
      const result =
        await AuditoryNeighborhoodCrimeDal.getAuditoryNeighborhoodsCrimesByDate(
          datetime
        );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAuditoryNeighborhoodsCrimesOffsetByDate(datetime, offset) {
    try {
      const result =
        await AuditoryNeighborhoodCrimeDal.getAuditoryNeighborhoodsCrimesOffsetByDate(
          datetime,
          offset
        );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
