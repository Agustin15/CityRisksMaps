import express from "express";
import { verifyParticipant } from "../controller/participantController.js";

export const RoutesParticipant = express.Router();

RoutesParticipant.post("/", (req, res) => {
  const { option } = req.body;

  if (!option) res.status(400).send("Variable option no definida");

  if (option == "verifyParticipant") {
    return verifyParticipant(req, res);
  }
});
