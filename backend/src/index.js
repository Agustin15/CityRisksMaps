import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { RoutesCrime } from "./route/routeCrime.js";
import { RoutesNeighborhoodCrime } from "./route/routeNeighborhoodCrime.js";
import { RoutesNeighborhoodCrimeAdmin } from "./route/routeNeighborhoodCrimeAdmin.js";
import { RoutesNeighbordhood } from "./route/routeNeighborhood.js";
import { RoutesLogin } from "./route/routeLogin.js";
import { RoutesLogout } from "./route/routeLogout.js";
import { RoutesDepartment } from "./route/routeDepartment.js";
import { RoutesPopulation } from "./route/routePopulation.js";
import { RoutesCrimeAdmin } from "./route/routeCrimeAdmin.js";
import { RoutesProfile } from "./route/routeProfile.js";
import { RoutesRol } from "./route/routeRol.js";
import { RoutesUser } from "./route/routeUser.js";
import { RoutesConfirmEmail } from "./route/routeConfirmEmail.js";

const limiterOptions = {
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  statusCode: 429,
  ipv6Subnet: 56,
  message: {
    messageError:
      "Alcanzo el limite de solicitudes, intente de nuevo en 15 minutos"
  }
};

const limitRate = rateLimit(limiterOptions);

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

app.use("/login/", RoutesLogin);
app.use("/profile/", RoutesProfile);
app.use("/logout/", RoutesLogout);
app.use("/confirmEmail/", RoutesConfirmEmail);
app.use("/crime/", RoutesCrime);
app.use("/neighborhood/", RoutesNeighbordhood);
app.use("/neighborhoodCrime/", RoutesNeighborhoodCrime);
app.use("/neighborhoodCrimeAdmin/", RoutesNeighborhoodCrimeAdmin);
app.use("/department/", RoutesDepartment);
app.use("/population/", RoutesPopulation);
app.use("/crimeAdmin/", RoutesCrimeAdmin);
app.use("/role/", RoutesRol);
app.use("/user/", RoutesUser);
app.use("/", (req, res) => {
  res.status(200).send("Servidor corriendo");
});
