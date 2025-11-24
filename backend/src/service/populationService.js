import { PopulationDAL } from "../dataAccess/populationDAL.js";

export class PopulationService {
  static async add(population) {
    try {
      if (population == null)
        throw new Error("Debe indicar un poblacion para agregar");
      const added = await PopulationDAL.add(population);

      return added;
    } catch (error) {
      throw error;
    }
  }

  static async update(population) {
    try {
      if (population == null)
        throw new Error("Debe indicar un poblacion para editar");

      const updated = await PopulationDAL.update(population);

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(idPopulation) {
    try {
      const deleted = await PopulationDAL.delete(idPopulation);

      return deleted;
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
}
