import { PopulationDAL } from "../dataAccessLayer/populationDAL.js";

export class PopulationService {
  static async add(population) {
    try {
      if (population == null)
        throw new Error("Debe indicar un poblacion para agregar");
      await PopulationDAL.add(population);
    } catch (error) {
      throw error;
    }
  }

  static async update(population) {
    try {
      if (population == null)
        throw new Error("Debe indicar un poblacion para editar");

      await PopulationDAL.update(population);
    } catch (error) {
      throw error;
    }
  }

  static async delete(idPopulation) {
    try {
      await PopulationDAL.delete(idPopulation);
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationById(idPopulation) {
    try {
      const result = await PopulationDAL.getPopulationById(idPopulation);
      if (result.recordset.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationByNeighborhoodAndYear(idNeighborhood, year) {
    try {
      const result = await PopulationDAL.getPopulationByNeighborhoodAndYear(
        idNeighborhood,
        year
      );

      if (result.recordset.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulations() {
    try {
      const result = await PopulationDAL.getPopulations();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsYears() {
    try {
      const result = await PopulationDAL.getPopulationsYears();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsByYear(year) {
    try {
      const result = await PopulationDAL.getPopulationsByYear(year);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getPopulationsOffsetByYear(offset, year) {
    try {
      const result = await PopulationDAL.getPopulationsOffsetByYear(
        offset,
        year
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsByNeighborhood(idNeighborhood) {
    try {
      const result =
        await PopulationDAL.getPopulationsByNeighborhood(idNeighborhood);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsOffsetByNeighborhood(idNeighborhood, offset) {
    try {
      const result = await PopulationDAL.getPopulationsOffsetByNeighborhood(
        idNeighborhood,
        offset
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
