import { CrimeDAL } from "../dataAccessLayer/crimeDAL.js";
import { Crime } from "../entity/crime.js";

export class CrimeService {
  static async add(crime) {
    try {
      if (crime == null) throw new Error("Debe indicar un crimen para agregar");

      await CrimeDAL.add(crime);
    } catch (error) {
      throw error;
    }
  }

  static async update(crime) {
    try {
      if (crime == null) throw new Error("Debe indicar un crimen para editar");
      await CrimeDAL.update(crime);
    } catch (error) {
      throw error;
    }
  }

  static async delete(category) {
    try {
      await CrimeDAL.delete(category);
    } catch (error) {
      throw error;
    }
  }

  static async getCrimeByCategory(category) {
    try {
      const result = await CrimeDAL.getCrimeByCategory(category);
      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  static async getAllTypeCrimes() {
    try {
      const result = await CrimeDAL.getAllTypeCrimes();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCrimesTypeOptions() {
    try {
      const result = await CrimeDAL.getCrimesTypeOptions();

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async validAndMappingCrimes(crimes) {
    const crimesMapping = [];

    for (const crime of crimes) {
      const crimeFound = await CrimeService.getCrimeByCategory(crime);

      if (!crimeFound)
        throw new Error(
          "No hay registro de un crimen con esta categoria en el sistema"
        );

      crimesMapping.push(
        new Crime(crimeFound.category, crimeFound.description)
      );
    }

    return crimesMapping;
  }
}
