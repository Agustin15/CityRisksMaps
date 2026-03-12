import sql from "mssql";
import { connection } from "../config/connection.js";

export class VerificationCodeDAL {
  static async add(verificationCode) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("code", sql.VarChar, verificationCode.code);
      request.input("idUser", sql.Int, verificationCode.user.idUser);
      request.input("expiration", sql.DateTime, verificationCode.expiration);

      const result = await request.execute("AddVerificationCode");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "Fecha de expiration debe ser mayor a la fecha actual del sistema"
          );

        case -2:
          throw new Error("No hay registro del usuario indicado en el sistema");

        case -3:
          throw new Error(
            "Ya existe este codigo de verificacion en el sistema"
          );

        case -4:
          throw new Error("Error inesperado al crear codigo de verificacion");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(verificationCode) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("code", sql.VarChar, verificationCode.code);
      request.input("idUser", sql.Int, verificationCode.user.idUser);
      request.input("expiration", sql.DateTime, verificationCode.expiration);

      const result = await request.execute("UpdateVerificationCode");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "Fecha de expiration debe ser mayor a la fecha actual del sistema"
          );

        case -2:
          throw new Error(
            "No se encontro este codigo de verificacion en el sistema"
          );
        case -3:
          throw new Error("No hay registros de este usuario en el sistema");

        case -4:
          throw new Error(
            "Error inesperado al actualizar codigo de verificacion"
          );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async delete(code) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("code", sql.VarChar, code);

      const result = await request.execute("DeleteVerificationCode");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No se encontro este codigo de verificacion en el sistema"
          );

        case -2:
          throw new Error(
            "Error inesperado al eliminar codigo de verificacion"
          );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getVerificationCodeMostRecentlyByUser(idUser) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);

      const result = await request.execute(
        "VerificationCodeMostRecentlyByIdUser"
      );

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getAllVerificationCodes() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllVerificationCodes");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getVerificationCodesOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("VerificationCodesOffset");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getVerificationCodesByUser(idUser) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);

      const result = await request.execute("VerificationCodesByUser");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getVerificationCodesByUserOffset(idUser, offset) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idUser", sql.Int, idUser);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("VerificationCodesByUserOffset");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
