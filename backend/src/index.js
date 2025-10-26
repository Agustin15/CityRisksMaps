import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connection } from "./config/connection.js";
import { RoutesCrime } from "./route/routeCrime.js";
import { RoutesNeighborhoodCrime } from "./route/routeNeighborhoodCrime.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.LOCALHOST_FRONTEND }));

try {
  if (!process.env.PORT) throw "PORT not declared";
  await connection.pool.connect();

  app.listen(process.env.PORT, () => {
    console.log("Listening in http://localhost:" + process.env.PORT);
  });
} catch (error) {
  console.log("Internal server error:", error.message);
  process.exit(1);
}

app.use("/crimes/", RoutesCrime);
app.use("/neighborhoodCrime/", RoutesNeighborhoodCrime);

