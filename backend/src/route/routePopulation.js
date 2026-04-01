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
import { verifyAuthorization } from "../controller/authorization.js";

export const RoutesPopulation = express.Router();

RoutesPopulation.use(verifyAuthToken);

RoutesPopulation.get(
  "/populationsOffsetYear/:year/:offset",
  getPopulationsOffsetByYear
);

RoutesPopulation.get(
  "/populationsOffsetNeighborhood/:nameNeighborhood/:offset",
  getPopulationsOffsetByNeighborhood
);
RoutesPopulation.get("/populationsYears", getPopulationsYears);
RoutesPopulation.get(
  "/datapointsNeighborhoodPopulationsYears/:nameNeighborhood",
  getDatapointsNeighborhoodPopulationsYears
);
RoutesPopulation.post("/", verifyAuthorization, add);
RoutesPopulation.put("/:idPopulation", verifyAuthorization, update);
RoutesPopulation.delete("/:idPopulation", verifyAuthorization, deleteById);
