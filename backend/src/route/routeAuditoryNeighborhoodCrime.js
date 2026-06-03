import express from "express";
import {
  getDatesOfAuditoryNeighborhoodsCrimes,
  getAuditoryNeighborhoodsCrimesByDate,
  getAuditoryNeighborhoodsCrimesOffsetByDate
} from "../controller/auditoryNeighborhoodCrimeController.js";
import { verifyAuthorization } from "../controller/authorization.js";
import { verifyAuthToken } from "../controller/authentication.js";

export const RoutesAuditoryNeighborhoodCrime = express.Router();

RoutesAuditoryNeighborhoodCrime.use(verifyAuthToken);

RoutesAuditoryNeighborhoodCrime.get(
  "/datesOfAuditoryNeighborhoodsCrimes",
  verifyAuthorization,
  getDatesOfAuditoryNeighborhoodsCrimes
);

RoutesAuditoryNeighborhoodCrime.get(
  "/auditoryNeighborhoodsCrimesByDate/:datetime",
  verifyAuthorization,
  getAuditoryNeighborhoodsCrimesByDate
);

RoutesAuditoryNeighborhoodCrime.get(
  "/auditoryNeighborhoodsCrimesOffsetByDate/:datetime/:offset",
  verifyAuthorization,
  getAuditoryNeighborhoodsCrimesOffsetByDate
);
