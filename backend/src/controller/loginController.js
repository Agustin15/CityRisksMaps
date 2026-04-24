import { User } from "../entity/user.js";
import { UserService } from "../service/userService.js";
import { RolService } from "../service/rolService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CloudinaryService } from "../service/cloudinaryService.js";

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

    let avatarUrl = null;

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

    if (userFound.avatar)
      avatarUrl = await CloudinaryService.getAvatar(userFound.avatar);

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
      sameSite: "lax",
      secure: true
    });

    res.cookie("authenticationRefreshToken", authenticationRefreshToken, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: true
    });

    res
      .status(200)
      .json({ ...userFound, ["rol"]: rolFound.name, ["avatarUrl"]: avatarUrl });
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};
