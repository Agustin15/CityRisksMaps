export const verifyAuthorization = (req, res, next) => {
  if (req.rol == "Admin") next();
  else
    res.status(403).json({
      messageError:
        "No cuenta con permisos suficientes para acceder a este recurso"
    });
};
