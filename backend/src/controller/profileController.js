import { UserService } from "../service/userService.js";

export const getProfile = async (req, res) => {
  try {
    if (req.idUser == null) throw new Error("ID de usuario no definido");

    const idUser = req.idUser;
    const rol = req.rol;

    const userFound = await UserService.getUserById(idUser);

    if (!userFound)
      throw new Error("No se encontro un usuario con este ID en el sistema");

    res.status(200).json({
      name: userFound.name,
      lastname: userFound.lastname,
      email: userFound.email,
      rol: rol
    });
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};
