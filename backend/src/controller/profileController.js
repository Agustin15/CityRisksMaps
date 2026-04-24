import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import jwt from "jsonwebtoken";
import * as jose from "jose";
import sql from "mssql";
import crypto from "crypto";
import { UserService } from "../service/userService.js";
import { sendMailToConfirmNewEmail } from "./sendMail.js";
import { CloudinaryService } from "../service/cloudinaryService.js";

export const getProfile = async (req, res) => {
  try {
    if (req.idUser == null) throw new Error("ID de usuario no definido");

    const idUser = req.idUser;
    const rol = req.rol;
    let avatarUrl = null;

    const userFound = await UserService.getUserById(idUser);

    if (!userFound)
      throw new Error("No se encontro un usuario con este ID en el sistema");

    if (userFound.avatar)
      avatarUrl = await CloudinaryService.getAvatar(userFound.avatar);

    res
      .status(200)
      .json({ ...userFound, ["rol"]: req.rol, ["avatarUrl"]: avatarUrl });
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    if (!req.params) throw new Error("Parametros de la solicitud no definidos");
    if (!req.body) throw new Error("Cuerpro de la solicitud no definido");

    const idUser = req.params.idUser;
    const { oldPassword, newPassword, repeatPassword } = req.body;

    if (!idUser) throw new Error("Debe indicar un usuario");
    if (!oldPassword || oldPassword.length == 0)
      throw new Error("Debe indicar la antigua contraseña");

    if (!newPassword || newPassword.length == 0)
      throw new Error("Debe indicar una nueva contraseña");

    if (!repeatPassword || repeatPassword.length == 0)
      throw new Error("Debe repetir la ingresada contraseña");

    if (repeatPassword != newPassword)
      throw new Error("Las contraseñas no coinciden");

    const userFound = await UserService.getUserById(idUser);

    if (!userFound)
      throw new Error("No se encontro un usuario con este ID en el sistema");

    let match = true;
    if (userFound.password.length == 60)
      match = bcrypt.compare(oldPassword, userFound.password);
    else if (userFound.password != oldPassword) match = false;

    if (!match)
      throw new Error("La contraseña antigua ingresada no es correcta");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await UserService.updateUserPasswordByIdUser(idUser, hash);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const updateCompleteNameByIdUser = async (req, res) => {
  try {
    if (!req.params) throw new Error("Parametros de la solicitud no definidos");
    if (!req.body) throw new Error("Cuerpo de la solicitud no definido");

    const idUser = req.params.idUser;
    const { name, lastname } = req.body;

    if (!idUser) throw new Error("Debe indicar un usuario");
    if (!name || name.length == 0) throw new Error("Debe indicar un nombre");

    if (!lastname || lastname.length == 0)
      throw new Error("Debe indicar un apellido");

    await UserService.updateCompleteNameByIdUser(idUser, name, lastname);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.params) throw new Error("Parametros de la solicitud no definidos");
    if (!req.body) throw new Error("Cuerpo de la solicitud no definido");

    if (!req.params.idUser) throw new Error("Debe indicar un usuario");

    if (
      !req.file ||
      (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpeg")
    )
      throw new Error("Debe indicar un imagen formato png o jpeg");

    if (req.file.size > 2000000)
      throw new Error("Tamaño del archivo excede el limite de 2MB");

    const idUser = req.params.idUser;
    const avatarUploaded = req.file;

    const result = await CloudinaryService.uploadAvatar(avatarUploaded, idUser);

    await UserService.updateAvatarByIdUser(idUser, result.public_id);

    res.status(200).json({ avatar: result.public_id, avatarUrl: result.url });
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    if (!req.params) throw new Error("Parametros de la solicitud no definidos");

    if (!req.params.idUser) throw new Error("Debe indicar un usuario");

    if (!req.params.avatarId) throw new Error("Debe indicar el avatar");

    const idUser = req.params.idUser;
    const avatarId = decodeURIComponent(req.params.avatarId);

    const result = await CloudinaryService.deleteAvatar(avatarId);

    await UserService.updateAvatarByIdUser(idUser, null);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const sendConfirmEmail = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de la solicitud no definido");

    const idUser = req.params.idUser;

    const { newEmail, password } = req.body;

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!idUser) throw new Error("Debe indicar un usuario");
    if (!newEmail) throw new Error("Debe indicar un email");
    if (!regexEmail.test(newEmail))
      throw new Error("Formato de correo no valido");
    if (!password || password.length == 0)
      throw new Error("Debe indicar su contraseña");

    if (!process.env.SECRET_KEY_CONFIRM_EMAIL_TOKEN)
      throw new Error("SECRET_KEY_CONFIRM_EMAIL_TOKEN no declarada");

    if (!process.env.ALGORITM_ENCRYPT_JWE_PAYLOAD)
      throw new Error("ALGORITM_ENCRYPT_JWE_PAYLOAD no declarado");

    if (!process.env.ALGORITM_ENCRYPT_JWE_IV)
      throw new Error("ALGORITM_ENCRYPT_JWE_IV no declarado");

    const secretKeyConfirmEmailToken =
      process.env.SECRET_KEY_CONFIRM_EMAIL_TOKEN;

    const algoritmIV = process.env.ALGORITM_ENCRYPT_JWE_IV;

    const algoritmPayload = process.env.ALGORITM_ENCRYPT_JWE_PAYLOAD;

    const userFound = await UserService.getUserById(idUser);

    if (!userFound)
      throw new Error("No se encontro un usuario con este ID en el sistema");

    let match = true;
    if (userFound.password.length == 60)
      match = bcrypt.compare(password, userFound.password);
    else if (userFound.password != password) match = false;

    if (!match)
      throw new Error(
        "Autenticacion fallida,la contraseña ingresada es incorrecta"
      );

    const jwtConfirmEmail = await new jose.EncryptJWT({
      idUser: idUser,
      newEmail: newEmail
    })
      .setProtectedHeader({ alg: algoritmIV, enc: algoritmPayload })
      .setExpirationTime("2h")
      .encrypt(new TextEncoder().encode(secretKeyConfirmEmailToken));

    await sendMailToConfirmNewEmail(newEmail, userFound.name, jwtConfirmEmail);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};
