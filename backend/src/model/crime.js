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
    if (value.trim().length == 0)
      throw new Error("Categoria no puede estar vacia");
    this.#category = value.trim();
  }

  get propCategory() {
    return this.#category;
  }

  set propDescription(value) {
    if (value.trim().length == 0)
      throw new Error("Descripcion no puede estar vacia");
    this.#description = value.trim();
  }

  get propDescription() {
    return this.#description;
  }

  async add() {
    try {
      const returnValue = await crimeDAL.add(
        this.propCategory,
        this.propDescription
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const identCurrent = await crimeDAL.getIdentCurrentTable();
      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await crimeDAL.update(
        this.propCategory,
        this.propDescription
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await crimeDAL.delete(this.propCategory);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getCrimeByCategory() {
    try {
      const result = await crimeDAL.getCrimeByCategory(this.propCategory);
      if (result.recordset.length > 0) {
        return new Crime(
          result.recordset[0].category,
          result.recordset[0].description
        );
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getCrimes() {
    try {
      const result = await crimeDAL.getCrimes();
      if (result.recordset.length > 0) {
        result.recordset.map((crime) => {
          return new Crime(crime.category, crime.description);
        });
      }
      return result.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
