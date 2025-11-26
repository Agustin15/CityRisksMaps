import { VerificationCodeDAL } from "../dataAccess/verificationCodeDAL.js";

export class VerificationCodeService {
  static async add(verificationCode) {
    try {
      if (!verificationCode)
        throw new Error("Debe indicar un codigo de verificacion para agregar");

      const added = VerificationCodeDAL.add(verificationCode);

      return added;
    } catch (error) {
      throw error;
    }
  }

  static async getVerificationCode(code) {
    try {
      const result = await VerificationCodeDAL.getVerificationCode(code);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
}
