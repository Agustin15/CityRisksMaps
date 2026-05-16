import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";
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

      await request.execute("AddUser");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
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

      await request.execute("UpdateUser");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }
  static async activateUser(idUser, password) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("password", sql.VarChar(60), password);

      await request.execute("activateUserByIdUser");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async updateEmailByIdUser(idUser, email) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("email", sql.VarChar(40), email);

      await request.execute("UpdateEmailByIdUser");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async updateUserPasswordByIdUser(idUser, password) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("password", sql.VarChar(60), password);

      await request.execute("UpdateUserPasswordByIdUser");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async updateCompleteNameByIdUser(idUser, name, lastname) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("name", sql.VarChar(20), name);
      request.input("lastname", sql.VarChar(20), lastname);

      await request.execute("UpdateCompleteNameByIdUser");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async delete(idUser) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);

      await request.execute("DeleteUser");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
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
  static async updateStateAuth2FA(idUser, state) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idUser", sql.Int, idUser);
      request.input("state", sql.Bit, state);

      await request.execute("UpdateStateAuth2FA");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }
}
