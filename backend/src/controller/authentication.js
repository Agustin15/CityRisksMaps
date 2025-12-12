import jwt from "jsonwebtoken";

export const verifyAuthToken = (token) => {
  try {
    if (!process.env.SECRET_KEY_TOKEN)
      throw new Error("Secrey key token no definida");

    if (!token) throw new Error("Autenticacion fallida, token no encontrado");

    const tokenDecoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);

    if (!tokenDecoded)
      throw new Error("Autenticacion fallida, token no valido");
  } catch (error) {
    if (error.message == "jwt expired")
      error.message = "Autenticacion fallida,token expirado";

    throw error;
  }
};
