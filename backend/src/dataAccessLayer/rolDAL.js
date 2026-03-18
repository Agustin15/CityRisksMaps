import { connection } from "../config/connection.js";
import sql from "mssql";

export class RolDAL {
  static async add(rol) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("name", sql.VarChar(10), rol.name);

      const result = await request.execute("AddRol");

      switch (result.returnValue) {
        case -1:
          throw new Error("Rol no debe tener mas de 10 caracteres", {
            cause: { code: 400 }
          });
        case -1:
          throw new Error("Ya existe un rol con este nombre en el sistema", {
            cause: { code: 409 }
          });

        case -3:
          throw new Error("Error inesperado al agregar rol", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async update(rol) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idRol", sql.Int, rol.idRol);
      request.input("name", sql.VarChar(10), rol.name);

      const result = await request.execute("UpdateRol");

      switch (result.returnValue) {
        case -1:
          throw new Error("Rol no debe tener mas de 10 caracteres", {
            cause: { code: 400 }
          });

        case -2:
          throw new Error("No se encontro un el rol indicado en el sistema", {
            cause: { code: 404 }
          });

        case -3:
          throw new Error("Ya existe un rol con este nombre en el sistema", {
            cause: { code: 409 }
          });

        case -4:
          throw new Error("Error inesperado al actualizar rol", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }
  static async delete(idRol) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idRol", sql.Int, idRol);

      const result = await request.execute("DeleteRol");

      switch (result.returnValue) {
        case -1:
          throw new Error("No se encontro un el rol indicado en el sistema", {
            cause: { code: 404 }
          });

        case -2:
          throw new Error("Error inesperado al eliminar rol", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async getAllRols() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllRols");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
