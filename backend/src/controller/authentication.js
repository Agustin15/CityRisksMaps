import jwt from "jsonwebtoken";

export const verifyAuthToken = (req, res, next) => {
  try {
    if (!process.env.SECRET_KEY_TOKEN)
      throw new Error("SECRET_KEY_TOKEN no declarada");

    if (!req.cookies.authenticacionToken) {
      refreshAuthToken(res);
    }

    const token = req.cookies.authenticacionToken;

    const tokenDecoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);

    if (!tokenDecoded)
      throw new Error("Autenticacion fallida, token no valido");

    next();
  } catch (error) {
    if (error.message == "jwt expired")
      error.message = "Autenticacion fallida,token expirado";

    res.status(401).json({ messageError: error.message });
  }
};

const refreshAuthToken = (res) => {
  try {
    if (!req.cookies.authenticacionRefreshToken)
      throw new Error(
        "Autenticacion fallida, token de actualizacion no encontrado"
      );

    if (!process.env.SECRET_KEY_REFRESH_TOKEN)
      throw new Error("SECRET_KEY_REFRESH_TOKEN no declarada");

    const tokenDecoded = jwt.verify(
      req.cookies.authenticacionRefreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!tokenDecoded)
      throw new Error(
        "Autenticacion fallida, token de actualizacion no valido"
      );

    jwt.sign(
      { idUser: tokenDecoded.idUser, idRol: tokenDecoded.idUser },
      process.env.SECRET_KEY_TOKEN,
      { expiresIn: "1h" }
    );

    res.cookie("authenticacionToken", authenticacionToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
  } catch (error) {
    throw error;
  }
};
