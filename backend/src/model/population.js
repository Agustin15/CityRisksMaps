import { PopulationDAL } from "../dataAccess/populationDAL.js";

const populationDAL = new PopulationDAL();

export class Population {
  #idPopulation;
  #quantity;
  #neighborhood;
  #year;

  constructor(
    idPopulation = 0,
    quantity = 0,
    neighborhood = "desconocido",
    year = new Date.getFullYear()
  ) {
    this.propIdPopulation = idPopulation;
    this.propQuantity = quantity;
    this.propNeighborhood = neighborhood;
    this.propYear = year;
  }

  set propIdPopulation(value) {
    if (typeof value != "number")
      throw new Error("Id poblacion debe ser un numero", {
        cause: { code: 400 }
      });
    this.#idPopulation = value;
  }

  get propIdPopulation() {
    return this.#idPopulation;
  }

  set propNeighborhood(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Barrio no puede estar vacio", { cause: { code: 400 } });
    this.#neighborhood = value.trim();
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }

  get propQuantity() {
    return this.#quantity;
  }
  set propQuantity(value) {
    if (!value || value < 0)
      throw new Error("Cantidad no puede ser un numero negativo", {
        cause: { code: 400 }
      });
    this.#quantity = value;
  }

  set propYear(value) {
    if (!value || value > new Date().getFullYear())
      throw new Error("Año no puede ser mayor al año actual", {
        cause: { code: 400 }
      });
    this.#year = value;
  }
  get propYear() {
    return this.#year;
  }

  async add() {
    try {
      const returnValue = await populationDAL.add(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await populationDAL.update(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await populationDAL.delete(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationById() {
    try {
      const result = await populationDAL.getPopulationById(this);
      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationByNeighborhoodAndYear() {
    try {
      const result = await populationDAL.getPopulationByNeighborhoodAndYear(
        this
      );

      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getPopulations() {
    try {
      const result = await populationDAL.getPopulations();
      result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
