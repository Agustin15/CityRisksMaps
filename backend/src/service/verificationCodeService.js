import { VerificationCodeDAL } from "../dataAccessLayer/verificationCodeDAL.js";
import bcrypt from "bcrypt";

export class VerificationCodeService {
  static async add(verificationCode) {
    try {
      if (!verificationCode)
        throw new Error("Debe indicar un codigo de verificacion para agregar", {
          cause: { code: 400 }
        });

      const salt = await bcrypt.genSalt(10);
      verificationCode.code = await bcrypt.hash(verificationCode.code, salt);

      await VerificationCodeDAL.add(verificationCode);
    } catch (error) {
      throw error;
    }
  }

  static async getVerificationCodeMostRecentlyByUser(idUser) {
    try {
      const result =
        await VerificationCodeDAL.getVerificationCodeMostRecentlyByUser(idUser);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
}
