import express from "express";
import { comprobateVerificationCode } from "../controller/verificationCodeController.js";

export const RoutesVerificationCode = express.Router();

RoutesVerificationCode.post("/", comprobateVerificationCode);
