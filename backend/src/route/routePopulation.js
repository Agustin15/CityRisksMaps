import express from "express";
import {
  add,
  deleteById,
  getPopulationsOffsetByNeighborhood,
  getPopulationsOffsetByYear,
  getPopulationsYears,
  getDatapointsNeighborhoodPopulationsYears,
  update
} from "../controller/populationController.js";
import { verifyAuthToken } from "../controller/authentication.js";

export const RoutesPopulation = express.Router();

RoutesPopulation.use(verifyAuthToken);

RoutesPopulation.get("/:paramsGet", (req, res) => {
  if (!req.params) res.status(400).send("Parametros de solicitud no definidos");

  if (!JSON.parse(req.params.paramsGet))
    res.status(400).send("paramsGet no definido");

  const { option } = JSON.parse(req.params.paramsGet);

  if (!option) res.status(400).send("option no definido");

  switch (option) {
    case "getPopulationsYears":
      return getPopulationsYears(req, res);
    case "getPopulationsOffsetByYear":
      return getPopulationsOffsetByYear(req, res);
    case "getPopulationsOffsetByNeighborhood":
      return getPopulationsOffsetByNeighborhood(req, res);
    case "getDatapointsNeighborhoodPopulationsYears":
      return getDatapointsNeighborhoodPopulationsYears(req, res);
  }
});

RoutesPopulation.post("/", add);
RoutesPopulation.put("/:idPopulation", update);
RoutesPopulation.delete("/:idPopulation", deleteById);
