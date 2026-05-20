import express from "express";
import {
  login,
  twoStepAuthenticacion,
  validateTwoStepAuthToken
} from "../controller/loginController.js";

export const RoutesLogin = express.Router();

RoutesLogin.get("/", (req, res) => res.status(200).json(true));
RoutesLogin.post("/", login);
RoutesLogin.get("/validateTwoStepAuthToken/", validateTwoStepAuthToken);
RoutesLogin.post("/twoStepAuth/", twoStepAuthenticacion);
