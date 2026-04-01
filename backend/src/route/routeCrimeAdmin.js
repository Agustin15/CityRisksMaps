import express from "express";
import {
  getAllTypeCrimes,
  update,
  add,
  deleteByCategory
} from "../controller/crimeController.js";
import { verifyAuthToken } from "../controller/authentication.js";
import { verifyAuthorization } from "../controller/authorization.js";

export const RoutesCrimeAdmin = express.Router();

RoutesCrimeAdmin.use(verifyAuthToken);

RoutesCrimeAdmin.get("/crimes", getAllTypeCrimes);

RoutesCrimeAdmin.post("/", verifyAuthorization, add);
RoutesCrimeAdmin.put("/:category", verifyAuthorization, update);
RoutesCrimeAdmin.delete("/:category", verifyAuthorization, deleteByCategory);
