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
    if (value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio");
    this.#name = value.trim();
  }

  get propName() {
    return this.#name;
  }

  set propDepartment(value) {
    if (typeof value != "number")
      throw new Error("Id de departamento debe ser un numero");
    this.#department = value;
  }

  get propDepartment() {
    return this.#department;
  }

  async add() {
    try {
      const returnValue = await neighborhoodDal.add(
        this.propName,
        this.propDepartment
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const identCurrent = await neighborhoodDal.getIdentCurrentTable();
      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await neighborhoodDal.update(
        this.propName,
        this.propDepartment
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await neighborhoodDal.delete(this.propName);
      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoods() {
    try {
      const result = await neighborhoodDal.getNeighborhoods();

      if (result.recordset.length > 0) {
        return result.recordset.map((neighbordhood) => {
          return new Neighborhood(
            neighbordhood.name,
            neighbordhood.idDepartment
          );
        });
      }
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodByName(name) {
    try {
      const result = await neighborhoodDal.getNeighborhoodByName(name);

      if (result.recordset.length > 0) {
        return new Neighborhood(
          result.recordset[0].name,
          result.recordset[0].idDepartment
        );
      } else null;
    } catch (error) {
      throw error;
    }
  }
}
