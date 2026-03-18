import express from "express";
import { login } from "../controller/loginController.js";

export const RoutesLogin = express.Router();

RoutesLogin.post("/", login);
