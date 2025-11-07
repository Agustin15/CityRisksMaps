import express from "express";
import {
  getCategoryCrimeInNeighborhood,
  getNeighborhoodsCrimeByYear,
  getYearsNeighborhoodsCrime
} from "../controller/neighborhoodCrimeController.js";

export const RoutesNeighborhoodCrime = express.Router();

RoutesNeighborhoodCrime.get("/:optionGet", (req, res) => {
  if (!req.params) {
    res.status(400).send("Parametros no definidos");
  }

  if (JSON.parse(!req.params.optionGet)) {
    res.status(400).send("optionGet no definido");
  }

  const { option } = JSON.parse(req.params.optionGet);

  switch (option) {
    case "getNeighborhoodsCrimeByYear":
      return getNeighborhoodsCrimeByYear(req, res);
    case "getYearsNeighborhoodsCrime":
      return getYearsNeighborhoodsCrime(req, res);
    case "getCategoryCrimeInNeighborhood":
      return getCategoryCrimeInNeighborhood(req, res);
  }
});
