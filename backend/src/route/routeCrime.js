import express from "express";
import { getCrimes } from "../controller/crimeController.js";

export const RoutesCrime = express.Router();

RoutesCrime.get("/:optionGet", (req, res) => {
  if (!req.params) {
    res.status(400).send("Parametros no definidos");
  }

  if (JSON.parse(!req.params.optionGet)) {
    res.status(400).send("optionGet no definido");
  }

  const { option } = JSON.parse(req.params.optionGet);

  switch (option) {
    case "getCrimes":
      return getCrimes(req, res);
  }
});
