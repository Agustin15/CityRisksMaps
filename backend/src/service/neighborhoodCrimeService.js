import { NeighborhoodCrimeDAL } from "../dataAccess/neighborhoodCrimeDAL.js";

export class NeighborhoodCrimeService {
  static async add(neighbordhoodCrime) {
    try {
      if (neighbordhoodCrime == null)
        throw new Error("Debe indicar un crimen de barrio para agregar");

      const added = await NeighborhoodCrimeDAL.add(neighbordhoodCrime);

      return added;
    } catch (error) {
      throw error;
    }
  }

  static async update(neighbordhoodCrime) {
    try {
      if (neighbordhoodCrime == null)
        throw new Error("Debe indicar un crimen de barrio para agregar");
      const updated = await NeighborhoodCrimeDAL.update(neighbordhoodCrime);

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(category, name, year) {
    try {
      const deleted = await NeighborhoodCrimeDAL.delete(category, name, year);
      return deleted;
    } catch (error) {
      throw error;
    }
  }
  static async getYearsNeighborhoodsCrime(category) {
    try {
      const result = await NeighborhoodCrimeDAL.getYearsNeighborhoodsCrime(
        category
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodsCrimeByYear(category, year) {
    try {
      const result = await NeighborhoodCrimeDAL.getNeighborhoodsCrimeByYear(
        category,
        year
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryCrimeInNeighborhood(category, nameNeighborhood) {
    try {
      const result = await NeighborhoodCrimeDAL.getCategoryCrimeInNeighborhood(
        category,
        nameNeighborhood
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
