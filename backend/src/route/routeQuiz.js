import express from "express";
import {
  getQuizesByNeighbordhoodAndYear,
  getQuizesYears
} from "../controller/quizController.js";

export const RoutesQuiz = express.Router();

RoutesQuiz.get("/:optionGet", (req, res) => {
  if (!req.params) {
    res.status(400).send("Parametros no definidos");
  }
  if (JSON.parse(!req.params).optionGet) {
    res.status(400).send("optionGet no definido");
  }
  const optionGet = JSON.parse(!req.params).optionGet;

  switch (optionGet) {
    case "getQuizesYears":
      return getQuizesYears;

    case "getQuizesByNeighbordhoodAndYear":
      return getQuizesByNeighbordhoodAndYear;
  }
});
