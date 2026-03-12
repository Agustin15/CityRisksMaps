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
}
