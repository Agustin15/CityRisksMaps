import express from "express";
import {
  getQuizesNeighbordhoodByYear,
  getQuizesYears
} from "../controller/quizController.js";

export const RoutesQuiz = express.Router();

RoutesQuiz.get("/:optionGet", (req, res) => {
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
  }
});
