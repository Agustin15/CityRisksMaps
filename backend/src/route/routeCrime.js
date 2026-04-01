import express from "express";
import { getAllTypeCrimes } from "../controller/crimeController.js";

export const RoutesCrime = express.Router();

RoutesCrime.get("/crimes",getAllTypeCrimes);


