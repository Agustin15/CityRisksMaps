import sql from "mssql";
import { connection } from "../config/connection.js";
import { getCodeHttpError } from "../httpCodeErrors.js";

export class VerificationCodeDAL {
  static async add(verificationCode,transaction) {
    try {
      const request = new sql.Request(transaction);

      request.input("code", sql.VarChar, verificationCode.code);
      request.input("idUser", sql.Int, verificationCode.user.idUser);
      request.input("expiration", sql.DateTime, verificationCode.expiration);

      await request.execute("AddVerificationCode");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
    }
  }

  static async UpdateVerificationCodeLikeUsed(code) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("code", sql.VarChar(60), code);

      await request.execute("UpdateVerificationCodeLikeUsed");
    } catch (error) {
      throw new Error(error.message, {
        cause: { code: getCodeHttpError(error.state) }
      });
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
}
