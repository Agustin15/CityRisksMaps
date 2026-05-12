import { DepartmentDAL } from "../dataAccessLayer/departmentDAL.js";

export class DepartmentService {
  static async add(department) {
    try {
      if (department == null)
        throw new Error("Debe indicar un departamento para agregar", {
          cause: { code: 400 }
        });
      await DepartmentDAL.add(department);
    } catch (error) {
      throw error;
    }
  }

  static async update(department) {
    try {
      if (department == null)
        throw new Error("Debe indicar un departamento para editar", {
          cause: { code: 400 }
        });

      await DepartmentDAL.update(department);
    } catch (error) {
      throw error;
    }
  }

  static async delete(idDepartment) {
    try {
      await DepartmentDAL.delete(idDepartment);
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
  static async getDepartmentsOffset(offset) {
    try {
      const result = await DepartmentDAL.getDepartmentsOffset(offset);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
