import express from "express";
import multer from "multer";
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 600000000 }
});

import {
  addThroughtTable,
  updateThroughtTable,
  getCategoryCrimeInNeighborhood,
  getNeighborhoodsCrimeByYearOffset,
  loadNeighborhoodsCrimeFromFile,
  getYearsNeighborhoodsCrime,
  getAmountAnCrimeInNeighborhoodByYear
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

RoutesNeighborhoodCrimeAdmin.post("/", verifyAuthorization, addThroughtTable);
RoutesNeighborhoodCrimeAdmin.put("/", verifyAuthorization, updateThroughtTable);

RoutesNeighborhoodCrimeAdmin.post(
  "/loadNeighborhoodsCrimeFromFile",
  upload.single("file"),
  verifyAuthorization,
  loadNeighborhoodsCrimeFromFile
);
