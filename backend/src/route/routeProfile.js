import express from "express";
import { getProfile } from "../controller/profileController.js";
import { verifyAuthToken } from "../controller/authentication.js";

export const RoutesProfile = express.Router();

RoutesProfile.use(verifyAuthToken);

RoutesProfile.get("/", getProfile);
