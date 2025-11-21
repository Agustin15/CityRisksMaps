import { CrimeDAL } from "../dataAccess/crimeDAL.js";

const crimeDAL = new CrimeDAL();

export class Crime {
  #category;
  #description;

  constructor(category = "desconocido", description = "desconocido") {
    this.propCategory = category;
    this.propDescription = description;
  }

  set propCategory(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Categoria no puede estar vacia", {
        cause: { code: 400 }
      });
    this.#category = value.trim();
  }

  get propCategory() {
    return this.#category;
  }

  set propDescription(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Descripcion no puede estar vacia", {
        cause: { code: 400 }
      });
    this.#description = value.trim();
  }

  get propDescription() {
    return this.#description;
  }

  async add() {
    try {
      const returnValue = await crimeDAL.add(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await crimeDAL.update(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await crimeDAL.delete(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getCrimeByCategory() {
    try {
      const result = await crimeDAL.getCrimeByCategory(this);
      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getAllTypeCrimes() {
    try {
      const result = await crimeDAL.getAllTypeCrimes();
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getCrimesTypeOptions() {
    try {
      const result = await crimeDAL.getCrimesTypeOptions();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
