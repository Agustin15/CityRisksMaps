import jwt from "jsonwebtoken";
import * as jose from "jose";

export const verifyAuthToken = (req, res, next) => {
  try {
    if (!process.env.SECRET_KEY_TOKEN)
      throw new Error("SECRET_KEY_TOKEN no declarada");

    if (!req.cookies.authenticationToken) {
      const jwtTokenRefreshed = refreshAuthToken(res, req);

      if (jwtTokenRefreshed) return next();
    }

    const jwtToken = req.cookies.authenticationToken;

    const jwtTokenDecoded = jwt.verify(jwtToken, process.env.SECRET_KEY_TOKEN);

    req.idUser = jwtTokenDecoded.idUser;
    req.rol = jwtTokenDecoded.rol;

    return next();
  } catch (error) {
    if (error.message === "TokenExpiredError")
      error.message = "Autenticacion fallida,token expirado";
    else if (error.name === "JsonWebTokenError")
      error.message = "Autenticacion fallida,token invalido";

    res.status(401).json({ messageError: error.message });
  }
};

const refreshAuthToken = (res, req) => {
  try {
    if (!req.cookies.authenticationRefreshToken)
      throw new Error(
        "Autenticacion fallida, token de actualizacion no encontrado"
      );

    if (!process.env.SECRET_KEY_REFRESH_TOKEN)
      throw new Error("SECRET_KEY_REFRESH_TOKEN no declarada");

    const jwtTokenDecoded = jwt.verify(
      req.cookies.authenticationRefreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!jwtTokenDecoded)
      throw new Error(
        "Autenticacion fallida, token de actualizacion no valido"
      );

    const authenticationToken = jwt.sign(
      { idUser: jwtTokenDecoded.idUser, rol: jwtTokenDecoded.rol },
      process.env.SECRET_KEY_TOKEN,
      { expiresIn: "1h" }
    );

    res.cookie("authenticationToken", authenticationToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: true
    });

    req.idUser = jwtTokenDecoded.idUser;
    req.rol = jwtTokenDecoded.rol;

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

    const jwtToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const jwtTokenDecoded = jwt.verify(
      jwtToken,
      process.env.SECRET_KEY_GENERATE_PASSWORD_TOKEN
    );

    return jwtTokenDecoded.idUser;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.message = "El token de acceso para activar el usuario ha expirado";
    } else if (error.name === "JsonWebTokenError") {
      error.message = "El token de acceso para activar usuario es invalido";
    }
    res.status(401).json({ messageError: error.message });
  }
};

export const verifyConfirmEmailToken = async (req, res) => {
  try {
    if (!process.env.SECRET_KEY_CONFIRM_EMAIL_TOKEN)
      throw new Error("SECRET_KEY_CONFIRM_EMAIL_TOKEN no declarada");

    const secretKeyConfirmEmailToken =
      process.env.SECRET_KEY_CONFIRM_EMAIL_TOKEN;

    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new Error("Acceso para confirmar el correo electronico no valido");

    const jwtToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const { payload, protectedHeader } = await jose.jwtDecrypt(
      jwtToken,
      new TextEncoder().encode(secretKeyConfirmEmailToken)
    );

    return payload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.message =
        "El acceso para confirmar el correo electronico ha expirado";
    } else if (error.name === "JsonWebTokenError") {
      error.message =
        "El acceso para confirmar el correo electronico no es valido";
    }
    res.status(401).json({ messageError: error.message });
  }
};
