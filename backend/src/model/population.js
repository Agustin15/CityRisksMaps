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
      throw new Error("Id poblacion debe ser un numero");
    this.#idPopulation = value;
  }

  get propIdPopulation() {
    return this.#idPopulation;
  }

  set propNeighborhood(value) {
    if (value.trim().length == 0)
      throw new Error("Barrio no puede estar vacio");
    this.#neighborhood = value.trim();
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }

  get propQuantity() {
    return this.#quantity;
  }
  set propQuantity(value) {
    if (value < 0) throw new Error("Cantidad no puede ser un numero negativo");
    this.#quantity = value;
  }

  set propYear(value) {
    if (value > new Date().getFullYear())
      throw new Error("Año no puede ser mayor al año actual");
    this.#year = value;
  }
  get propYear() {
    return this.#year;
  }

  async add() {
    try {
      const returnValue = await populationDAL.add(
        this.propNeighborhood,
        this.propQuantity,
        this.propYear
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const identCurrent = await populationDAL.getIdentCurrentTable();
      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await populationDAL.update(
        this.propIdPopulation,
        this.propNeighborhood,
        this.propQuantity
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await populationDAL.delete(this.propIdPopulation);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationById() {
    try {
      const result = await populationDAL.getPopulationById(
        this.propIdPopulation
      );

      if (result.recordset.length > 0) {
        return new Population(
          result.recordset[0].idPopulation,
          result.recordset[0].quantity,
          result.recordset[0].neighborhood,
          result.recordset[0].year
        );
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getPopulationByNeighborhoodAndYear() {
    try {
      const result = await populationDAL.getPopulationByNeighborhoodAndYear(
        this.propNeighborhood,
        this.propYear
      );

      if (result.recordset.length > 0) {
        return new Population(
          result.recordset[0].idPopulation,
          result.recordset[0].quantity,
          result.recordset[0].neighborhood,
          result.recordset[0].year
        );
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getPopulations() {
    try {
      if (result.recordset.length > 0) {
        return result.recordset.map((population) => {
          return new Population(
            population.idPopulation,
            population.quantity,
            population.neighborhood,
            population.year
          );
        });
      }
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
