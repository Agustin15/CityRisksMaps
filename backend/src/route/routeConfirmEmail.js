import express from "express";
import { confirmEmail } from "../controller/confirmEmailController.js";

export const RoutesConfirmEmail = express.Router();

RoutesConfirmEmail.put("/", confirmEmail);
