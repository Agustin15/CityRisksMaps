import { connection } from "../config/connection.js";
import sql from "mssql";

export class UserDAL {
  static async add(user) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(50), user.email);
      request.input("name", sql.VarChar(20), user.name);
      request.input("lastname", sql.VarChar(20), user.lastname);
      request.input("password", sql.VarChar(60), user.password);
      request.input("rol", sql.Int, user.rol.idRol);

      const result = await request.execute("AddUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Nombre no debe tener mas de 20 caracteres", {
            cause: { code: 400 }
          });

        case -2:
          throw new Error("Apellido no debe tener mas de 20 caracteres", {
            cause: { code: 400 }
          });

        case -3:
          throw new Error("Correo no debe tener mas de 50 caracteres", {
            cause: { code: 400 }
          });
        case -4:
          throw new Error("Ingrese un correo con formato valido", {
            cause: { code: 400 }
          });

        case -5:
          throw new Error("No se encontro el rol indicado en el sistema", {
            cause: { code: 404 }
          });

        case -6:
          throw new Error("Correo ingresado ya en uso", {
            cause: { code: 409 }
          });

        case -7:
          throw new Error("Error inesperado al agregar usuario", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }
  static async update(user) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, user.idUser);
      request.input("email", sql.VarChar(50), user.email);
      request.input("name", sql.VarChar(20), user.name);
      request.input("lastname", sql.VarChar(20), user.lastname);
      request.input("password", sql.VarChar(60), user.password);
      request.input("rol", sql.Int, user.rol.idRol);

      const result = await request.execute("UpdateUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Nombre no debe tener mas de 20 caracteres", {
            cause: { code: 400 }
          });

        case -2:
          throw new Error("Apellido no debe tener mas de 20 caracteres", {
            cause: { code: 400 }
          });

        case -3:
          throw new Error("Correo no debe tener mas de 50 caracteres", {
            cause: { code: 400 }
          });
        case -4:
          throw new Error("Ingrese un correo con formato valido", {
            cause: { code: 400 }
          });
        case -5:
          throw new Error(
            "No se encontro el el usuario indicado en el sistema",
            {
              cause: { code: 404 }
            }
          );

        case -6:
          throw new Error("No se encontro el rol indicado en el sistema", {
            cause: { code: 404 }
          });

        case -7:
          throw new Error("Correo ingresado ya en uso", {
            cause: { code: 409 }
          });

        case -8:
          throw new Error("Error inesperado al actualizar usuario", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }
  static async delete(idUser) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);

      const result = await request.execute("DeleteUser");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No se encontro el el usuario indicado en el sistema",
            {
              cause: { code: 404 }
            }
          );

        case -2:
          throw new Error("Error inesperado al eliminarusuario", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllUsers");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getUsersOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("UsersOffset");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getUsersByRol(idRol) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idRol", sql.Int, idRol);

      const result = await request.execute("UsersByRol");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(idUser) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idUser", sql.Int, idUser);

      const result = await request.execute("UserById");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getUserByEmail(email) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("email", sql.VarChar(50), email);

      const result = await request.execute("UserByEmail");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
