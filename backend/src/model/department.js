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
    if (!value || value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio", { cause: { code: 400 } });
    this.#name = value.trim();
  }

  get propName() {
    return this.#name;
  }
  set propIdDepartment(value) {
    if (typeof value != "number")
      throw new Error("Id departamento debe ser un numero", {
        cause: { code: 400 }
      });
    this.#idDepartment = value;
  }

  get propIdDepartment() {
    return this.#idDepartment;
  }

  async add() {
    try {
      const returnValue = await departmentDAL.add(this);
      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await departmentDAL.update(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await departmentDAL.delete(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentByName() {
    try {
      const result = await departmentDAL.getDepartmentByName(this);

      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  async getDepartments() {
    try {
      const result = await departmentDAL.getDepartments();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
