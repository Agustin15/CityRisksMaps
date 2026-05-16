import { VerificationCodeDAL } from "../dataAccessLayer/verificationCodeDAL.js";

export class VerificationCodeService {
  static async add(verificationCode,transaction) {
    try {
      if (!verificationCode)
        throw new Error("Debe indicar un codigo de verificacion para agregar", {
          cause: { code: 400 }
        });

      await VerificationCodeDAL.add(verificationCode,transaction);
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
