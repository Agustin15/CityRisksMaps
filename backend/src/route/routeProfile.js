import express from "express";
import multer from "multer";
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2000000 }
});
import {
  getProfile,
  resetPassword,
  sendConfirmEmail,
  updateCompleteNameByIdUser
} from "../controller/profileController.js";

import { verifyAuthToken } from "../controller/authentication.js";

export const RoutesProfile = express.Router();

RoutesProfile.use(verifyAuthToken);

RoutesProfile.get("/", getProfile);
RoutesProfile.put("/resetPassword/:idUser", resetPassword);
RoutesProfile.put("/updateCompleteName/:idUser", updateCompleteNameByIdUser);
RoutesProfile.post("/sendConfirmEmail/:idUser", sendConfirmEmail);
