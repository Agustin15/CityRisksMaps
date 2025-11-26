import sql from "mssql";
import { connection } from "../config/connection.js";

export class VerificationCodeDAL {
  static async add(verificationCode) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("code", sql.VarChar, verificationCode.code);
      request.input(
        "participant",
        sql.VarChar,
        verificationCode.participant.email
      );
      request.input("expiration", sql.DateTime, verificationCode.expiration);
      request.input("attempts", sql.Int, verificationCode.Int);

      const result = await request.execute("AddVerificationCode");

      switch (result.returnValue) {
        case -1:
          throw new Error("Formato de codigo no valido");
        case -2:
          throw new Error("No hay registro participante en el sistema");

        case -3:
          throw new Error(
            "Ya hay registro de este codigo de verificacion en el sistema"
          );

        case -4:
          throw new Error("Error inesperado al crear codigo de verificacion");
      }

      return result.returnValue;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getVerificationCode(code) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("code", sql.VarChar, code);

      const result = await request.execute("VerificationCodeByCode");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
