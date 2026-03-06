import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { RoutesCrime } from "./route/routeCrime.js";
import { RoutesNeighborhoodCrime } from "./route/routeNeighborhoodCrime.js";
import { RoutesNeighbordhood } from "./route/routeNeighborhood.js";
import { RoutesQuiz } from "./route/routeQuiz.js";
import { RoutesParticipant } from "./route/routeParticipant.js";
import { RoutesVerificationCode } from "./route/routeVerificationCode.js";
import cookieParser from "cookie-parser";


const limiterOptions = {
  windowMs: 30 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  statusCode: 429,
  ipv6Subnet: 56,
  message: {
    messageError:
      "Alcanzo el limite de solicitudes, intente de nuevo en 30 minutos"
  }
};

const limitRate = rateLimit(limiterOptions);
const limitRateVerificationCode = rateLimit({
  ...limiterOptions,
  ["limit"]: 4,
  ["message"]: {
    messageError: "Demasiados intentos, intente de nuevo en 30 minutos"
  }
});

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.LOCALHOST_FRONTEND, credentials: true }));
app.use(cookieParser());
app.use(limitRate);

try {
  if (!process.env.PORT) throw "PORT not declared";

  app.listen(process.env.PORT, () => {
    console.log("Listening in http://localhost:" + process.env.PORT);
  });
} catch (error) {
  console.log("Internal server error:", error.message);
  process.exit(1);
}

app.use("/crimes/", RoutesCrime);
app.use("/neighborhood/", RoutesNeighbordhood);
app.use("/neighborhoodCrime/", RoutesNeighborhoodCrime);
app.use("/participant/", limitRateVerificationCode, RoutesParticipant);
app.use(
  "/verificationCode/",
  limitRateVerificationCode,
  RoutesVerificationCode
);
app.use("/quiz/", RoutesQuiz);
