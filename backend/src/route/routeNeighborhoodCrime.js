import express from "express";
import {
  getCategoryCrimeInNeighborhood,
  getNeighborhoodsCrimeByYear,
  getYearsNeighborhoodsCrime
} from "../controller/neighborhoodCrimeController.js";

export const RoutesNeighborhoodCrime = express.Router();

RoutesNeighborhoodCrime.get(
  "/neighborhoodsCrimesByYear/:categoryCrime/:year",
  getNeighborhoodsCrimeByYear
);

RoutesNeighborhoodCrime.get(
  "/yearsNeighborhoodsCrime/:categoryCrime",
  getYearsNeighborhoodsCrime
);

RoutesNeighborhoodCrime.get(
  "/categoryCrimeInNeighborhood/:categoryCrime/:idNeighborhood",
  getCategoryCrimeInNeighborhood
);


