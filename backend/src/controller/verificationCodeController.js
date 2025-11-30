import { VerificationCodeService } from "../service/verificationCodeService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const comprobateVerificationCode = async (req, res) => {
  try {
    const { email, codeEntered } = req.body;

    if (!email || email.length == 0) throw new Error("Debe ingresar un correo");

    if (!codeEntered)
      throw new Error("Debe ingresar el codigo de verificacion");

    if (!process.env.SECRET_KEY_TOKEN)
      throw new Error("SECRET_KEY_TOKEN no declarado");

    const verificationCodeFound =
      await VerificationCodeService.getVerificationCodeMostRecentlyByEmail(
        email
      );

    if (!verificationCodeFound)
      throw new Error("No tienes asociado un codigo de verificacion aun");

    const match = await bcrypt.compare(codeEntered, verificationCodeFound.code);

    if (new Date(verificationCodeFound.expiration) <= new Date() || !match)
      throw new Error("Codigo de verificacion ingresado no valido");

    const token = jwt.sign({ email: email }, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "1 day"
    });

    res.cookie("authToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none"
    });

    res.status(200).json(true);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
