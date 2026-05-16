import jwt from "jsonwebtoken";
import { User } from "../entity/user.js";
import { VerificationCode } from "../entity/verificationCode.js";
import { VerificationCodeService } from "../service/verificationCodeService.js";
import { sendVerificationCode } from "./sendMail.js";
import { connection } from "../config/connection.js";
import bcrypt from "bcrypt";
import sql from "mssql";

export const createVerificationCode = async (user) => {
  let transaction;
  try {
    const user = new User(
      user.idUser,
      user.name,
      user.lastname,
      user.email,
      user.password,
      user.rol
    );

    const verificationCode = new VerificationCode(user);

    verificationCode.code = await bcrypt.hash(verificationCode.code, 10);

    transaction = new sql.Transaction(connection.pool);
    
    await transaction.begin(sql.ISOLATION_LEVEL.READ_COMMITTED);

    await VerificationCodeService.add(verificationCode,transaction);

    await sendVerificationCode(verificationCode.code, verificationCode.user);

    const token2FA = jwt.sign(
      { idUser: verificationCode.user.idUser },
      process.env.SECRET_KEY_2FA_TOKEN,
      { expiresIn: "15m" }
    );

    await transaction.commit();

    return token2FA;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};
