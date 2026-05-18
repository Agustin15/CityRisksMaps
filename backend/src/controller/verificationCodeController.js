import jwt from "jsonwebtoken";
import { User } from "../entity/user.js";
import { VerificationCode } from "../entity/verificationCode.js";
import { VerificationCodeService } from "../service/verificationCodeService.js";
import { sendVerificationCode } from "./sendMail.js";
import { connection } from "../config/connection.js";
import bcrypt from "bcrypt";
import sql from "mssql";

export const createVerificationCode = async (userFound) => {
  let transaction;
  try {
    const user = new User(
      userFound.idUser,
      userFound.name,
      userFound.lastname,
      userFound.email,
      userFound.password,
      userFound.rol
    );

    const verificationCode = new VerificationCode(user);

    const code = verificationCode.code;

    const salt = await bcrypt.genSalt(10);

    verificationCode.code = await bcrypt.hash(
      verificationCode.code.toString(),
      salt
    );

    transaction = new sql.Transaction(connection.pool);

    await transaction.begin(sql.ISOLATION_LEVEL.READ_COMMITTED);

    await VerificationCodeService.add(verificationCode, transaction);

    await sendVerificationCode(code, verificationCode.user);

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
