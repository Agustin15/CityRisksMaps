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

  static async getPopulationByNeighborhoodAndYear(name, year) {
    try {
      const result = await PopulationDAL.getPopulationByNeighborhoodAndYear(
        name,
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
  static async getPopulationsOffset(offset) {
    try {
      const result = await PopulationDAL.getPopulationsOffset(offset);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getPopulationsByNeighborhood(neighborhood) {
    try {
      const result =
        await PopulationDAL.getPopulationsByNeighborhood(neighborhood);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
