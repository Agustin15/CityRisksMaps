import express from "express";
import {
  getCrimesTypeOptions,
  getAllTypeCrimes
} from "../controller/crimeController.js";

export const RoutesCrime = express.Router();

RoutesCrime.get("/:optionGet", (req, res) => {
  if (!req.params) res.status(400).send("Parametros de solicitud no definidos");

  if (!JSON.parse(req.params.optionGet)) {
    res.status(400).send("optionGet no definido");
  }

  const { option } = JSON.parse(req.params.optionGet);

  if (!option) res.status(400).send("option no definido");

  switch (option) {
    case "getCrimes":
      return getCrimesTypeOptions(req, res);
    case "getAllTypeCrimes":
      return getAllTypeCrimes(req, res);
  }
});
