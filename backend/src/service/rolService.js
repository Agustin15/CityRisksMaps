import { RolDAL } from "../dataAccessLayer/rolDAL.js";

export class RolService {
  static async add(rol) {
    try {
      if (!rol) throw new Error("Debe indicar un rol para agregar");
      await RolDAL.add(rol);
    } catch (error) {
      throw error;
    }
  }

  static async update(rol) {
    try {
      if (!rol) throw new Error("Debe indicar un rol para actualizar");

      await RolDAL.update(rol);
    } catch (error) {
      throw error;
    }
  }

  static async delete(idRol) {
    try {
      await RolDAL.delete(idRol);
    } catch (error) {
      throw error;
    }
  }

  static async getAllRols() {
    try {
      const result = await RolDAL.getAllRols();
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getRolById(idRol) {
    try {
      const result = await RolDAL.getRolById(idRol);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
  static async getRolByName(rolName) {
    try {
      const result = await RolDAL.getRolByName(rolName);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
}
