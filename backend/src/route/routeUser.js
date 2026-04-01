import express from "express";
import {
  add,
  deleteById,
  getUsersOffset,
  update,
  activate,
  validateActivateUserToken,
  getUsersByRolOffset
} from "../controller/userController.js";
import { verifyAuthToken } from "../controller/authentication.js";
import { verifyAuthorization } from "../controller/authorization.js";

export const RoutesUser = express.Router();

//Rutas sin verificación de token de autenticación ni autorización
RoutesUser.post("/validate-activate-user-token", validateActivateUserToken);
RoutesUser.post("/activate", activate);

//Rutas con verificación de token de autenticación y autorización
RoutesUser.use(verifyAuthToken);
RoutesUser.use(verifyAuthorization);

RoutesUser.get("/usersOffset/:offset", getUsersOffset);
RoutesUser.get("/usersByRoleOffset/:roleName/:offset", getUsersByRolOffset);

RoutesUser.post("/", add);
RoutesUser.put("/:idUser", update);
RoutesUser.delete("/:idUser", deleteById);
