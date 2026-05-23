import express from "express";
import {
  addThroughtTable,
  updateThroughtTable,
  getCategoryCrimeInNeighborhood,
  getNeighborhoodsCrimeByYearOffset,
  getYearsNeighborhoodsCrime,
  getAmountAnCrimeInNeighborhoodByYear,
  getAmountOfDifferentsCrimesInNeighborhoodInYear,
  getIncreaseOfCrimeInYears,
  getIncreaseOfCrimeInNeighborhood,
  getAllYearsOfCrimes,
  getAmountOfAnCrimeInNeighborhoodsByYear,
  deleteById
} from "../controller/neighborhoodCrimeController.js";
import { verifyAuthToken } from "../controller/authentication.js";
import { verifyAuthorization } from "../controller/authorization.js";

export const RoutesNeighborhoodCrimeAdmin = express.Router();

RoutesNeighborhoodCrimeAdmin.use(verifyAuthToken);

RoutesNeighborhoodCrimeAdmin.get(
  "/neighborhoodsCrimesByYearOffset/:categoryCrime/:year/:offset",
  getNeighborhoodsCrimeByYearOffset
);

RoutesNeighborhoodCrimeAdmin.get(
  "/yearsNeighborhoodsCrime/:categoryCrime",
  getYearsNeighborhoodsCrime
);

RoutesNeighborhoodCrimeAdmin.get(
  "/categoryCrimeInNeighborhood/:categoryCrime/:idNeighborhood",
  getCategoryCrimeInNeighborhood
);

RoutesNeighborhoodCrimeAdmin.get(
  "/amountAnCrimeInNeighborhoodByYear/:categoryCrime/:year/:neighborhoodsCrimeToGet",
  verifyAuthorization,
  getAmountAnCrimeInNeighborhoodByYear
);

RoutesNeighborhoodCrimeAdmin.get(
  "/increaseOfCrimeInYears/:categoryCrime",
  getIncreaseOfCrimeInYears
);
RoutesNeighborhoodCrimeAdmin.get(
  "/increaseOfCrimeInNeighborhood/:categoryCrime/:idNeighborhood",
  getIncreaseOfCrimeInNeighborhood
);

RoutesNeighborhoodCrimeAdmin.get("/allYears", getAllYearsOfCrimes);

RoutesNeighborhoodCrimeAdmin.get(
  "/amountOfDifferentsCrimesInNeighborhoodInYear/:idNeighborhood/:year",
  getAmountOfDifferentsCrimesInNeighborhoodInYear
);

RoutesNeighborhoodCrimeAdmin.get(
  "/amountOfAnCrimeInNeighborhoodsByYear/:crime/:year/:offset",
  getAmountOfAnCrimeInNeighborhoodsByYear
);

RoutesNeighborhoodCrimeAdmin.post("/", verifyAuthorization, addThroughtTable);
RoutesNeighborhoodCrimeAdmin.put("/", verifyAuthorization, updateThroughtTable);

RoutesNeighborhoodCrimeAdmin.delete(
  "/:idCompound",
  verifyAuthorization,
  deleteById
);
