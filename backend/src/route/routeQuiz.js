import express from "express";
import {
  getQuizesNeighbordhoodByYear,
  getQuizesYears,
  getSecurityPercentagesInNeighborhood,
  getYearsOfParticipantQuizes,
  add,
  getQuizesByParticipantAndYear,
  getLimitQuizesByParticipantAndYear,
  deleteQuiz
} from "../controller/quizController.js";
import { verifyAuthToken } from "../controller/authentication.js";

export const RoutesQuiz = express.Router();

RoutesQuiz.get("/:optionGet", (req, res) => {
  try {
    verifyAuthToken(req.cookies.authToken);
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }

  if (!req.params) {
    res.status(400).send("Parametros no definidos");
  } else if (!JSON.parse(req.params.optionGet)) {
    res.status(400).send("optionGet no definido");
  }

  const { option } = JSON.parse(req.params.optionGet);

  if (!option) res.status(400).send("option no definido");

  switch (option) {
    case "getQuizesYears":
      return getQuizesYears(req, res);

    case "getQuizesNeighbordhoodByYear":
      return getQuizesNeighbordhoodByYear(req, res);

    case "getSecurityPercentagesInNeighborhood":
      return getSecurityPercentagesInNeighborhood(req, res);

    case "getYearsOfParticipantQuizes":
      return getYearsOfParticipantQuizes(req, res);

    case "getQuizesByParticipantAndYear":
      return getQuizesByParticipantAndYear(req, res);

    case "getLimitQuizesByParticipantAndYear":
      return getLimitQuizesByParticipantAndYear(req, res);

    case "getLimitQuizesByParticipantAndYear":
      return getLimitQuizesByParticipantAndYear(req, res);
  }
});

RoutesQuiz.post("/", add);
RoutesQuiz.delete("/:idQuiz", deleteQuiz);
