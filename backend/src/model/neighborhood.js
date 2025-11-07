import { NeighborhoodDAL } from "../dataAccess/neighborhoodDal.js";

const neighborhoodDal = new NeighborhoodDAL();

export class Neighborhood {
  #name;
  #department;

  constructor(name = "desconocido", department = 0) {
    this.propName = name;
    this.propDepartment = department;
  }

  set propName(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio", { cause: { code: 400 } });
    this.#name = value.trim();
  }

  get propName() {
    return this.#name;
  }

  set propDepartment(value) {
    if (typeof value != "number")
      throw new Error("Id de departamento debe ser un numero", {
        cause: { code: 400 }
      });
    this.#department = value;
  }

  get propDepartment() {
    return this.#department;
  }

  async add() {
    try {
      const returnValue = await neighborhoodDal.add(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await neighborhoodDal.update(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await neighborhoodDal.delete(this);
      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoods() {
    try {
      const result = await neighborhoodDal.getNeighborhoods();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodByName() {
    try {
      const result = await neighborhoodDal.getNeighborhoodByName(this);

      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
}
