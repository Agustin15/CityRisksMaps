import express from "express";
import { logout } from "../controller/logoutController.js";

export const RoutesLogout = express.Router();

RoutesLogout.post("/", logout);
