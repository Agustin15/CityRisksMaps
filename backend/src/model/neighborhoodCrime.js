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
    if (!value || value.trim().length == 0)
      throw new Error("Nombre de delito no puede estar vacio", {
        cause: { code: 400 }
      });
    this.#crime = value.trim();
  }

  get propCrime() {
    return this.#crime;
  }

  set propNeighborhood(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Barrio no puede estar vacio", { cause: { code: 400 } });
    this.#neighborhood = value.trim();
  }

  get propNeighborhood() {
    return this.#neighborhood;
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

  get propQuantity() {
    return this.#quantity;
  }
  set propQuantity(value) {
    if (value < 0) throw new Error("Cantidad no puede ser un numero negativo");
    this.#quantity = value;
  }

  async add() {
    try {
      const returnValue = await neighborhoodCrimeDal.add(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await neighborhoodCrimeDal.update(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await neighborhoodCrimeDal.delete(this);
      return returnValue;
    } catch (error) {
      throw error;
    }
  }
  async getYearsNeighborhoodsCrime() {
    try {
      const result = await neighborhoodCrimeDal.getYearsNeighborhoodsCrime(
        this
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodsCrimeByYear() {
    try {
      const result = await neighborhoodCrimeDal.getNeighborhoodsCrimeByYear(
        this
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryCrimeInNeighborhood() {
    try {
      const result = await neighborhoodCrimeDal.getCategoryCrimeInNeighborhood(
        this
      );

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
