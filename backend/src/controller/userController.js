import { connection } from "../config/connection.js";
import { User } from "../entity/user.js";
import { UserService } from "../service/userService.js";
import { RolService } from "../service/rolService.js";
import { Rol } from "../entity/rol.js";
import { sendActivateUserMail } from "./sendMail.js";
import { verifyActivateUserToken } from "./authentication.js";
import { CloudinaryService } from "../service/cloudinaryService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sql from "mssql";

export const add = async (req, res) => {
  let transaction;
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    if (!process.env.SECRET_KEY_GENERATE_PASSWORD_TOKEN)
      throw new Error("SECRET_KEY_GENERATE_PASSWORD_TOKEN no declarada");

    const secretKeyGeneratePassword =
      process.env.SECRET_KEY_GENERATE_PASSWORD_TOKEN;

    const { email, name, lastname, idRol } = req.body;

    const rolFound = await RolService.getRolById(idRol);

    if (!rolFound)
      throw new Error("No se encontro el rol indicado en el sistema");

    const rol = new Rol(rolFound.idRol, rolFound.name);

    const user = new User(0, name, lastname, email);
    user.rol = rol;

    transaction = new sql.Transaction(connection.pool);

    await transaction.begin();

    const idUserAdded = await UserService.add(user, transaction);

    const activateUserToken = jwt.sign(
      { idUser: idUserAdded },
      secretKeyGeneratePassword,
      {
        expiresIn: "12h"
      }
    );

    await sendActivateUserMail(email, name, activateUserToken);

    await transaction.commit();
    res.status(200).json(true);
  } catch (error) {
    if (transaction) await transaction.rollback();

    res.status(502).json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    if (!req.params.idUser) throw new Error("Usuario no indicado");

    const { email, name, lastname, idRol } = req.body;
    const idUser = parseInt(req.params.idUser);

    const rolFound = await RolService.getRolById(idRol);

    if (!rolFound)
      throw new Error("No se encontro un rol con este ID en el sistema");

    const rol = new Rol(rolFound.idRol, rolFound.name);

    const userFound = await UserService.getUserById(idUser);

    if (!userFound)
      throw new Error("No se encontro un usuario con este ID en el sistema");

    const user = new User(idUser, name, lastname, email);
    user.rol = rol;

    await UserService.update(user);

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const deleteById = async (req, res) => {
  let transaction = null;
  try {
    if (!req.params.idUser) throw new Error("Usuario no indicado");
    const idUser = req.params.idUser;

    const userFound = await UserService.getUserById(idUser);
    if (!userFound)
      throw new Error("No se encontro un usuario con este ID en el sistema");

    if (!userFound.avatar) {
      await UserService.deleteById(idUser);
    } else {
      transaction = new sql.Transaction(connection.pool);

      await UserService.deleteById(idUser);
      await CloudinaryService.deleteAvatar(userFound.avatar);

      await transaction.commit();
    }

    res.status(200).json(true);
  } catch (error) {
    if (transaction) await transaction.rollback();

    res.status(404).json({ messageError: error.message });
  }
};

export const getUsersOffset = async (req, res) => {
  try {
    if (req.params.offset == null) throw new Error("Offset no definido");

    const offset = req.params.offset;

    const users = await UserService.getAllUsers();

    if (users.length == 0)
      throw new Error("No se encontraron usuarios en el sistema");

    const usersOffset = await UserService.getUsersOffset(offset);

    if (usersOffset.length == 0)
      throw new Error("No se encontraron usuarios en el sistema");

    res.status(200).json({
      registersOffset: usersOffset,
      pages: Math.ceil(users.length / 10)
    });
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getUsersByRolOffset = async (req, res) => {
  try {
    if (req.params.offset == null) throw new Error("Offset no definido");
    if (req.params.roleName == null) throw new Error("Rol no indicado");

    const offset = req.params.offset;
    const roleName = req.params.roleName;

    const rolFound = await RolService.getRolByName(roleName);

    if (!rolFound)
      throw new Error("No se encontro un rol con este nombre en el sistema");

    const users = await UserService.getUsersByRol(rolFound.idRol);

    if (users.length == 0)
      throw new Error("No se encontraron usuarios en el sistema");

    const usersOffset = await UserService.getUsersByRolOffset(
      rolFound.idRol,
      offset
    );

    if (usersOffset.length == 0)
      throw new Error("No se encontraron usuarios con este rol en el sistema");

    res.status(200).json({
      registersOffset: usersOffset,
      pages: Math.ceil(users.length / 10)
    });
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const activate = async (req, res) => {
  try {
    const idUser = verifyActivateUserToken(req, res);

    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    const { email, password } = req.body;

    if (!email) throw new Error("Correo electrónico no indicado");
    if (!password) throw new Error("Contraseña no indicada");

    const userFound = await UserService.getUserByEmail(email);

    if (!userFound) throw new Error("Usuario no encontrado");

    if (userFound.idUser != idUser) throw new Error("Usuario no autorizado");

    if (userFound.activated)
      throw new Error("¡El usuario ya ha sido activado!");

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    await UserService.activateUserByIdUser(idUser, hashedPassword);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const validateActivateUserToken = async (req, res) => {
  try {
    const idUser = verifyActivateUserToken(req, res);

    const userFound = await UserService.getUserById(idUser);

    if (!userFound) throw new Error("Usuario no encontrado");

    if (userFound.activated)
      throw new Error("¡El usuario ya ha sido activado!");

    res.status(200).json(true);
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};
