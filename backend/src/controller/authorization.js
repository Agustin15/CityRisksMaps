export const verifyAuthorization = (req, res, next) => {
  if (req.rol == "Admin") return next();
  else
    return res.status(403).json({
      messageError:
        "No cuenta con permisos suficientes para acceder a este recurso"
    });
};
