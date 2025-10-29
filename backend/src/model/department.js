import { DepartmentDAL } from "../dataAccess/departmentDAL.js";
const departmentDAL = new DepartmentDAL();

export class Department {
  #idDepartment;
  #name;

  constructor(idDepartment = 0, name = "desconocido") {
    this.propIdDepartment = idDepartment;
    this.propName = name;
  }

  set propName(value) {
    if (value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio");
    this.#name = value.trim();
  }

  get propName() {
    return this.#name;
  }
  set propIdDepartment(value) {
    if (typeof value != "number")
      throw new Error("Id departamento debe ser un numero");
    this.#idDepartment = value;
  }

  get propIdDepartment() {
    return this.#idDepartment;
  }

  async add() {
    try {
      const returnValue = await departmentDAL.add(this.propName);
      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const identCurrent = await departmentDAL.getIdentCurrentTable();
      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await departmentDAL.update(
        this.propIdDepartment,
        this.propName
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await departmentDAL.delete(this.propIdDepartment);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentByName() {
    try {
      const result = await departmentDAL.getDepartmentByName(this.propName);

      if (result.recordset.length > 0) {
        return new Department(
          result.recordset[0].idDepartment,
          result.recordset[0].name
        );
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getDepartments() {
    try {
      const result = await departmentDAL.getDepartments();

      if (result.recordset.length > 0) {
        return result.recordset.map((departament) => {
          return new Department(departament.idDepartment, departament.name);
        });
      }
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
