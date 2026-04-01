import { UserDAL } from "../dataAccessLayer/userDAL.js";

export class UserService {
  static async add(user, transaction) {
    try {
      if (!user) throw new Error("Debe indicar un usuario para agregar");

      const idUser = await UserDAL.add(user, transaction);
      return idUser;
    } catch (error) {
      throw error;
    }
  }
  static async update(user) {
    try {
      if (!user) throw new Error("Debe indicar un usuario para actualizar");

      await UserDAL.update(user);
    } catch (error) {
      throw error;
    }
  }

  static async activateUserByIdUser(idUser, password) {
    try {
      await UserDAL.activateUser(idUser, password);
    } catch (error) {
      throw error;
    }
  }

  static async updateUserPasswordByIdUser(idUser, password) {
    try {
      await UserDAL.updateUserPasswordByIdUser(idUser, password);
    } catch (error) {
      throw error;
    }
  }
  static async delete(idUser) {
    try {
      await UserDAL.delete(idUser);
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const result = await UserDAL.getAllUsers();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUsersOffset(offset) {
    try {
      const result = await UserDAL.getUsersOffset(offset);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUsersByRol(idRol) {
    try {
      const result = await UserDAL.getUsersByRol(idRol);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUsersByRolOffset(idRol, offset) {
    try {
      const result = await UserDAL.getUsersByRolOffset(idRol, offset);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getUserById(idUser) {
    try {
      const result = await UserDAL.getUserById(idUser);

      if (result.length > 0) return result[0];
      else return null;
    } catch (error) {
      throw error;
    }
  }
  static async getUserByEmail(email) {
    try {
      const result = await UserDAL.getUserByEmail(email);

      if (result.length > 0) return result[0];
      else return null;
    } catch (error) {
      throw error;
    }
  }
  static async getUserActivatedByEmail(email) {
    try {
      const result = await UserDAL.getUserActivatedByEmail(email);

      if (result.length > 0) return result[0];
      else return null;
    } catch (error) {
      throw error;
    }
  }
}
