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
  static async getAmountOfAnCrimeInYears(crime) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getAmountOfAnCrimeInYears(crime);

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
  static async getAmountOfAnCrimeInNeighborhoodInYears(crime, neighborhood) {
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

  static async getTopTenNeighborhoodsWithMoreTypeOfCrime(crime) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getTopTenNeighborhoodsWithMoreTypeOfCrime(
          crime
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getTopTenNeighborhoodsWithLessTypeOfCrime(crime) {
    try {
      const result =
        await NeighborhoodCrimeDAL.getTopTenNeighborhoodsWithLessTypeOfCrime(
          crime
        );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
