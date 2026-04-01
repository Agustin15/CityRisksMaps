import jwt from "jsonwebtoken";

export const verifyAuthToken = (req, res, next) => {
  try {
    if (!process.env.SECRET_KEY_TOKEN)
      throw new Error("SECRET_KEY_TOKEN no declarada");

    if (!req.cookies.authenticacionToken) {
      const tokenRefreshed = refreshAuthToken(res, req);
      if (tokenRefreshed) next();
    }

    const token = req.cookies.authenticacionToken;

    const tokenDecoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);

    if (!tokenDecoded)
      throw new Error("Autenticacion fallida, token no valido");

    req.idUser = tokenDecoded.idUser;
    req.rol = tokenDecoded.rol;

    next();
  } catch (error) {
    if (error.message == "jwt expired")
      error.message = "Autenticacion fallida,token expirado";

    res.status(401).json({ messageError: error.message });
  }
};

const refreshAuthToken = (res, req) => {
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

    const authenticacionToken = jwt.sign(
      { idUser: tokenDecoded.idUser, rol: tokenDecoded.rol },
      process.env.SECRET_KEY_TOKEN,
      { expiresIn: "1h" }
    );

    res.cookie("authenticacionToken", authenticacionToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    req.idUser = tokenDecoded.idUser;
    req.rol = tokenDecoded.rol;

    return true;
  } catch (error) {
    throw error;
  }
};

export const verifyActivateUserToken = (req, res) => {
  try {
    if (!process.env.SECRET_KEY_GENERATE_PASSWORD_TOKEN)
      throw new Error("SECRET_KEY_GENERATE_PASSWORD_TOKEN no declarada");

    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new Error(
        "Token de acceso para activar el usuario no proporcionado"
      );

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY_GENERATE_PASSWORD_TOKEN
    );

    if (!decoded.idUser)
      throw new Error("El token de acceso para activar el usuario es invalido");

    return decoded.idUser;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        messageError: "El token de acceso para activar el usuario ha expirado"
      });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        messageError: "El token de acceso para activar usuario es invalido"
      });
    } else {
      res.status(401).json({ messageError: error.message });
    }
  }
};
