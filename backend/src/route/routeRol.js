import express from "express";
import {
  getRols,
  update,
  add,
  deleteById
} from "../controller/rolController.js";
import { verifyAuthToken } from "../controller/authentication.js";
import { verifyAuthorization } from "../controller/authorization.js";

export const RoutesRol = express.Router();

RoutesRol.use(verifyAuthToken);
RoutesRol.use(verifyAuthorization);

RoutesRol.get("/allRols", getRols);

RoutesRol.post("/", add);
RoutesRol.put("/:idRol", update);
RoutesRol.delete("/:idRol", deleteById);
