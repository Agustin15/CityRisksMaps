import { NeighborhoodCrimeDAL } from "../dataAccess/neighborhoodCrimeDAL.js";

const neighborhoodCrimeDal = new NeighborhoodCrimeDAL();

export class NeighborhoodCrime {
  #crime;
  #neighborhood;
  #quantity;
  #year;

  constructor(
    crime = "desconocido",
    neighbordhood = "desconocido",
    quantity = 0,
    year = new Date().getFullYear()
  ) {
    this.propCrime = crime;
    this.propNeighborhood = neighbordhood;
    this.propQuantity = quantity;
    this.propYear = year;
  }

  set propCrime(value) {
    if (value.trim().length == 0)
      throw new Error("Nombre de delito no puede estar vacio");
    this.#crime = value.trim();
  }

  get propCrime() {
    return this.#crime;
  }

  set propNeighborhood(value) {
    if (value.trim().length == 0)
      throw new Error("Barrio no puede estar vacio");
    this.#neighborhood = value.trim();
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }
  set propYear(value) {
    if (value > new Date().getFullYear())
      throw new Error("Año no puede ser mayor al año actual");
    this.#year = value;
  }
  get propYear() {
    return this.#year;
  }

  get propQuantity() {
    return this.#quantity;
  }
  set propQuantity(value) {
    if (value < 0) throw new Error("Cantidad no puede ser un numero negativo");
    this.#quantity = value;
  }

  async add() {
    try {
      const returnValue = await neighborhoodCrimeDal.add(
        this.propNeighborhood,
        this.propCrime,
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
      const identCurrent = await neighborhoodCrimeDal.getIdentCurrentTable();
      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await neighborhoodCrimeDal.update(
        this.propNeighborhood,
        this.propCrime,
        this.propQuantity,
        this.propYear
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await neighborhoodCrimeDal.delete(
        this.propNeighborhood,
        this.propCrime
      );
      return returnValue;
    } catch (error) {
      throw error;
    }
  }
  async getYearsNeighborhoodsCrime() {
    try {
      const result = await neighborhoodCrimeDal.getYearsNeighborhoodsCrime(
        this.propCrime
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodsCrimeByYear() {
    try {
      const result = await neighborhoodCrimeDal.getNeighborhoodsCrimeByYear(
        this.propCrime,
        this.propYear
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
