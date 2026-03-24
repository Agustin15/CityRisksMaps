import { User } from "../entity/user.js";
import { UserService } from "../service/userService.js";
import { RolService } from "../service/rolService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.SECRET_KEY_TOKEN)
      throw new Error("JWT_SECRET_KEY_TOKEN no declarado");

    if (!process.env.SECRET_KEY_REFRESH_TOKEN)
      throw new Error("JWT_SECRET_KEY_REFRESH_TOKEN no declarado");

    const user = new User();
    user.email = email;
    user.password = password;

    const userFound = await UserService.getUserByEmail(user.email);

    if (!userFound) throw new Error("Usuario no encontrado  en el sistema");

    if (userFound.password.length == 60) {
      const match = await bcrypt.compare(user.password, userFound.password);
      if (!match) throw new Error("Usuario o contraseña incorrectas");
    } else if (userFound.password != user.password) {
      throw new Error("Usuario o contraseña incorrectas");
    }

    const rolFound = await RolService.getRolById(userFound.rol);

    if (!rolFound)
      throw new Error("No se encontro un rol con este ID en el sistema");

    const authenticacionToken = jwt.sign(
      { idUser: userFound.idUser, rol: rolFound.name },
      process.env.SECRET_KEY_TOKEN,
      {
        expiresIn: "1h"
      }
    );

    const authenticacionRefreshToken = jwt.sign(
      { idUser: userFound.idUser, rol: rolFound.name },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      {
        expiresIn: "24h"
      }
    );

    res.cookie("authenticacionToken", authenticacionToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax"
    });

    res.cookie("authenticacionRefreshToken", authenticacionRefreshToken, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
      sameSite: "lax"
    });

    res.status(200).json({
      name: userFound.name,
      lastname: userFound.lastname,
      email: userFound.email,
      rol: rolFound.name
    });
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};
