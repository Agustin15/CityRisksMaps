import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entity/user.js";
import { UserService } from "../service/userService.js";
import { RolService } from "../service/rolService.js";
import { createVerificationCode } from "./verificationCodeController.js";
import { VerificationCodeService } from "../service/verificationCodeService.js";
import { verifyTwoStepAuthToken } from "./authentication.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.SECRET_KEY_TOKEN)
      throw new Error("JWT_SECRET_KEY_TOKEN no declarado");

    if (!process.env.SECRET_KEY_REFRESH_TOKEN)
      throw new Error("JWT_SECRET_KEY_REFRESH_TOKEN no declarado");

    if (!process.env.SECRET_KEY_2FA_TOKEN)
      throw new Error("JWT_SECRET_KEY_2FA_TOKEN no declarado");

    const user = new User();
    user.email = email;
    user.password = password;

    const userFound = await UserService.getUserActivatedByEmail(user.email);

    if (!userFound) throw new Error("Usuario o contraseña incorrectas");

    if (userFound.password.length == 60) {
      const match = await bcrypt.compare(user.password, userFound.password);
      if (!match) throw new Error("Usuario o contraseña incorrectas");
    } else if (userFound.password != user.password) {
      throw new Error("Usuario o contraseña incorrectas");
    }

    const rolFound = await RolService.getRolById(userFound.rol);

    if (!rolFound)
      throw new Error("No se encontro un rol con este ID en el sistema");

    if (userFound.auth2FA == false) {
      createAuthenticacionTokens(res, userFound, rolFound);
      delete userFound["password"];
      return res
        .status(200)
        .json({ user: { ...userFound, ["rol"]: rolFound.name } });
    } else {
      const token2FA = await createVerificationCode(userFound);
      return res.status(200).json({ token2FA: token2FA });
    }
  } catch (error) {
    return res.status(401).json({ messageError: error.message });
  }
};

const createAuthenticacionTokens = async (res, userFound, rolFound) => {
  const authenticationToken = jwt.sign(
    { idUser: userFound.idUser, rol: rolFound.name },
    process.env.SECRET_KEY_TOKEN,
    {
      expiresIn: "1h"
    }
  );

  const authenticationRefreshToken = jwt.sign(
    { idUser: userFound.idUser, rol: rolFound.name },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    {
      expiresIn: "24h"
    }
  );

  res.cookie("authenticationToken", authenticationToken, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  res.cookie("authenticationRefreshToken", authenticationRefreshToken, {
    maxAge: 60 * 60 * 1000 * 24,
    httpOnly: true,
    sameSite: "none",
    secure: true
  });
};

export const validateTwoStepAuthToken = async (req, res) => {
  try {
    const idUser = verifyTwoStepAuthToken(req, res);

    const userFound = await UserService.getUserById(idUser);

    if (!userFound) throw new Error("Usuario no encontrado");

    return res.status(200).json(userFound.email);
  } catch (error) {
    return res.status(401).json({ messageError: error.message });
  }
};

export const twoStepAuthenticacion = async (req, res) => {
  try {
    const idUser = verifyTwoStepAuthToken(req, res);

    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    const { code } = req.body;

    if (!code) throw new Error("Debe indicar el codigo de verificacion");

    const verificationCodeFound =
      await VerificationCodeService.getVerificationCodeMostRecentlyByUser(
        idUser
      );

    if (!verificationCodeFound)
      throw new Error("El codigo de verificacion es incorrecto");

    const match = await bcrypt.compare(code, verificationCodeFound.code);

    if (!match || verificationCodeFound.expiration < new Date())
      throw new Error("El codigo de verificacion es incorrecto");

    const userFound = await UserService.getUserById(idUser);

    if (!userFound)
      throw new Error("No se encontro un usuario con este ID en el sistema");

    const rolFound = await RolService.getRolById(userFound.rol);

    if (!rolFound)
      throw new Error("No se encontro un rol con este ID en el sistema");

    await VerificationCodeService.updateVerificationCodeLikeUsed(
      verificationCodeFound.code
    );

    createAuthenticacionTokens(res, userFound, rolFound);

    delete userFound["password"];
    return res.status(200).json({ ...userFound, ["rol"]: rolFound.name });
  } catch (error) {
    return res.status(401).json({ messageError: error.message });
  }
};
