import { connection } from "../config/connection.js";
import sql from "mssql";

export class UserDAL {
  static async add(user, transaction) {
    try {
      const request = new sql.Request(transaction);

      request.input("email", sql.VarChar(40), user.email);
      request.input("name", sql.VarChar(20), user.name);
      request.input("lastname", sql.VarChar(20), user.lastname);
      request.input("activated", sql.Bit, 0);
      request.input("rol", sql.Int, user.rol.idRol);

      const result = await request.execute("AddUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Ingrese un correo con formato valido", {
            cause: { code: 400 }
          });

        case -2:
          throw new Error("Nombre no puede estar vacio", {
            cause: { code: 400 }
          });
        case -3:
          throw new Error("Apellido no puede estar vacio", {
            cause: { code: 400 }
          });
        case -4:
          throw new Error("No se encontro el rol indicado en el sistema", {
            cause: { code: 404 }
          });

        case -5:
          throw new Error("Correo ingresado ya en uso", {
            cause: { code: 409 }
          });

        case -6:
          throw new Error("Error inesperado al agregar usuario", {
            cause: { code: 502 }
          });
      }

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }
  static async update(user) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, user.idUser);
      request.input("email", sql.VarChar(40), user.email);
      request.input("name", sql.VarChar(20), user.name);
      request.input("lastname", sql.VarChar(20), user.lastname);
      request.input("rol", sql.Int, user.rol.idRol);

      const result = await request.execute("UpdateUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Ingrese un correo con formato valido", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Nombre no puede estar vacio", {
            cause: { code: 400 }
          });
        case -3:
          throw new Error("Apellido no puede estar vacio", {
            cause: { code: 400 }
          });
        case -4:
          throw new Error(
            "No se encontro el el usuario indicado en el sistema",
            {
              cause: { code: 404 }
            }
          );

        case -5:
          throw new Error("No se encontro el rol indicado en el sistema", {
            cause: { code: 404 }
          });

        case -6:
          throw new Error("Correo ingresado ya en uso", {
            cause: { code: 409 }
          });

        case -7:
          throw new Error("Error inesperado al actualizar usuario", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }
  static async activateUser(idUser, password) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("password", sql.VarChar(60), password);

      const result = await request.execute("activateUserByIdUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Contraseña no puede estar vacia", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error(
            "No se encontro el el usuario indicado en el sistema",
            {
              cause: { code: 404 }
            }
          );

        case -3:
          throw new Error("Error inesperado al activar el usuario", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateEmailByIdUser(idUser, email) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("email", sql.VarChar(40), email);

      const result = await request.execute("UpdateEmailByIdUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Formato de correo electronico no valido", {
            cause: { code: 404 }
          });

        case -2:
          throw new Error("No se encontro el usuario indicado en el sistema", {
            cause: { code: 404 }
          });

        case -3:
          throw new Error("La verificacion de este correo ya se ha realizado", {
            cause: { code: 409 }
          });

        case -4:
          throw new Error(
            "Ya existe un usuario con este correo en el sistema",
            {
              cause: { code: 409 }
            }
          );
        case -5:
          throw new Error("Error inesperado al actualizar correo electronico", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateUserPasswordByIdUser(idUser, password) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("password", sql.VarChar(60), password);

      const result = await request.execute("UpdateUserPasswordByIdUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Contraseña no puede estar vacia", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("No se encontro el usuario indicado en el sistema", {
            cause: { code: 404 }
          });

        case -3:
          throw new Error(
            "Error inesperado al actualizar contraseña del usuario",
            {
              cause: { code: 502 }
            }
          );
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateCompleteNameByIdUser(idUser, name, lastname) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("name", sql.VarChar(20), name);
      request.input("lastname", sql.VarChar(20), lastname);

      const result = await request.execute("UpdateCompleteNameByIdUser");

      switch (result.returnValue) {
        case -1:
          throw new Error("Nombre no puede estar vacio", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Apellido no puede estar vacio", {
            cause: { code: 400 }
          });

        case -3:
          throw new Error(
            "No se encontro el el usuario indicado en el sistema",
            {
              cause: { code: 404 }
            }
          );
        case -4:
          throw new Error("Error inesperado al actualizar  usuario", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateAvatarByIdUser(idUser, avatar) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("avatar", sql.Varchar(100), avatar);

      const result = await request.execute("UpdateAvatarById");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No se encontro el el usuario indicado en el sistema",
            {
              cause: { code: 404 }
            }
          );

        case -2:
          throw new Error("Error inesperado al actualizar avatar del usuario", {
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

      const result = await request.execute("UsersByRole");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getUsersByRolOffset(idRol, offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idRol", sql.Int, idRol);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("UsersByRoleOffset");

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
      request.input("email", sql.VarChar(40), email);

      const result = await request.execute("UserByEmail");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getUserActivatedByEmail(email) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("email", sql.VarChar(40), email);

      const result = await request.execute("UserActivatedByEmail");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
