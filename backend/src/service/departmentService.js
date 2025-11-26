import { DepartmentDAL } from "../dataAccess/departmentDAL.js";

export class DepartmentService {
  static async add(department) {
    try {
      if (department == null)
        throw new Error("Debe indicar un departamento para agregar");
      const added = await DepartmentDAL.add(department);
      return added;
    } catch (error) {
      throw error;
    }
  }

  static async update(department) {
    try {
      if (department == null)
        throw new Error("Debe indicar un departamento para editar");

      const updated = await DepartmentDAL.update(department);

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(idDepartment) {
    try {
      const deleted = await DepartmentDAL.delete(idDepartment);

      return deleted;
    } catch (error) {
      throw error;
    }
  }

  static async getDepartmentByName(name) {
    try {
      const result = await DepartmentDAL.getDepartmentByName(name);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
  static async getDepartmentById(idDepartment) {
    try {
      const result = await DepartmentDAL.getDepartmentById(idDepartment);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  static async getDepartments() {
    try {
      const result = await DepartmentDAL.getDepartments();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
