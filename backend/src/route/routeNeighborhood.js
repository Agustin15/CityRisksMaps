import express from "express";
import { getNeighborhoodsWithoutQuizByYear } from "../controller/neighborhoodController.js";

export const RoutesNeighbordhood = express.Router();

RoutesNeighbordhood.get("/:optionGet", (req, res) => {
  if (!req.params) {
    res.status(400).send("Parametros no definidos");
  } else if (!JSON.parse(req.params.optionGet)) {
    res.status(400).send("optionGet no definido");
  }

  const { option } = JSON.parse(req.params.optionGet);

  if (!option) res.status(400).send("option no definido");

  switch (option) {
    case "getNeighborhoodsWithoutQuizByYear":
      return getNeighborhoodsWithoutQuizByYear(req, res);
  }
});
