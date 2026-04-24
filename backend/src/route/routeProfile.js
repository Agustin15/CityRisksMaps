import express from "express";
import multer from "multer";
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2000000 }
});
import {
  deleteAvatar,
  getProfile,
  resetPassword,
  sendConfirmEmail,
  updateAvatar,
  updateCompleteNameByIdUser
} from "../controller/profileController.js";

import { verifyAuthToken } from "../controller/authentication.js";

export const RoutesProfile = express.Router();

RoutesProfile.use(verifyAuthToken);

RoutesProfile.get("/", getProfile);
RoutesProfile.put("/resetPassword/:idUser", resetPassword);
RoutesProfile.put("/updateCompleteName/:idUser", updateCompleteNameByIdUser);
RoutesProfile.put("/avatar/:idUser", upload.single("avatar"), updateAvatar);
RoutesProfile.put("/avatar/:idUser/delete/:avatarId", deleteAvatar);
RoutesProfile.post("/sendConfirmEmail/:idUser", sendConfirmEmail);
