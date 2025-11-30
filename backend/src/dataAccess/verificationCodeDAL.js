import sql from "mssql";
import { connection } from "../config/connection.js";

export class VerificationCodeDAL {
  static async add(verificationCode, transaction) {
    try {
      const request = new sql.Request(transaction);

      request.input("code", sql.VarChar, verificationCode.code);
      request.input(
        "participant",
        sql.VarChar,
        verificationCode.participant.email
      );
      request.input("expiration", sql.DateTime, verificationCode.expiration);

      const result = await request.execute("AddVerificationCode");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "Fecha de expiration debe ser mayor a la fecha actual del sistema"
          );

        case -2:
          throw new Error(
            "No hay registro de un participante con este correo en el sistema"
          );

        case -3:
          throw new Error(
            "Ya existe este codigo de verificacion en el sistema"
          );

        case -4:
          throw new Error("Error inesperado al crear codigo de verificacion");
      }

      return result.returnValue;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getVerificationCodeMostRecentlyByEmail(email) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar, email);

      const result = await request.execute(
        "VerificationCodeMostRecentlyByEmail"
      );

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
