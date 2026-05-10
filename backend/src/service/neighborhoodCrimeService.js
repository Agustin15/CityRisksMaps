import { NeighborhoodCrimeDAL } from "../dataAccessLayer/neighborhoodCrimeDAL.js";

export class NeighborhoodCrimeService {
  static async addThroughtTable(neighbordhoodsCrime, crime, year) {
    try {
      if (neighbordhoodsCrime == null || neighbordhoodsCrime.length == 0)
        throw new Error("Debe indicar crimenes de barrios para agregar");

      await NeighborhoodCrimeDAL.addThroughtTable(
        neighbordhoodsCrime,
        crime,
        year
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateThroughtTable(neighbordhoodsCrime, crime, year) {
    try {
      if (neighbordhoodsCrime == null || neighbordhoodsCrime.length == 0)
        throw new Error("Debe indicar crimenes de barrios para actualizar");

      await NeighborhoodCrimeDAL.updateThroughtTable(
        neighbordhoodsCrime,
        crime,
        year
      );
    } catch (error) {
      throw error;
    }
  }

  static async delete(category, idNeighborhood, year) {
    try {
      await NeighborhoodCrimeDAL.delete(category, idNeighborhood, year);
    } catch (error) {
      throw error;
    }
  }
  static async getYearsNeighborhoodsCrime(category) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getYearsNeighborhoodsCrime(category);

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAmountAnCrimeInNeighborhoodByYear(
    category,
    year,
    idNeighborhood
  ) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getAmountAnCrimeInNeighborhoodByYear(
          category,
          year,
          idNeighborhood
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

  static async getNeighborhoodsCrimeByYearSecondVersion(category, year) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getNeighborhoodsCrimeByYearSecondVersion(
          category,
          year
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodsCrimeByYearOffset(category, year, offset) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getNeighborhoodsCrimeByYearOffset(
          category,
          year,
          offset
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryCrimeInNeighborhood(category, idNeighborhood) {
    try {
      const result = await NeighborhoodCrimeDAL.getCategoryCrimeInNeighborhood(
        category,
        idNeighborhood
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getIncreaseOfCrimeInYears(crime) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getIncreaseOfCrimeInYears(crime);

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getIncreaseOfCrimeInNeighborhood(crime, idNeighborhood) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getIncreaseOfCrimeInNeighborhood(
          crime,
          idNeighborhood
        );

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getAllYearsOfCrimes() {
    try {
      const result = await NeighborhoodCrimeDAL.getAllYearsOfCrimes();

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAmountOfAnCrimeInNeighborhoodsByYear(crime, year) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getAmountOfAnCrimeInNeighborhoodsByYear(
          crime,
          year
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAmountOfDifferentsCrimesInNeighborhoodInYear(
    idNeighborhood,
    year
  ) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getAmountOfDifferentsCrimesInNeighborhoodInYear(
          idNeighborhood,
          year
        );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
