import express from "express";
import {
  getAmountOfAnCrimeInNeighborhoodsByCurrentAndPastYear,
  getCategoryCrimeInNeighborhood,
  getIncreaseOfCrimeInYears,
  getNeighborhoodsCrimeByYear,
  getYearsNeighborhoodsCrime
} from "../controller/neighborhoodCrime/neighborhoodCrimeController.js";

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

RoutesNeighborhoodCrime.get(
  "/increaseOfCategoryCrimeInYears/:categoryCrime/",
  getIncreaseOfCrimeInYears
);

RoutesNeighborhoodCrime.get(
  "/amountOfAnCrimeInNeighborhoodsByCurrentAndPastYear/:crime/:year/:offset",
  getAmountOfAnCrimeInNeighborhoodsByCurrentAndPastYear
);
