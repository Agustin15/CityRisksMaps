import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { sendConsultation } from "./controller/sendConsultation.js";
import { RoutesCrime } from "./route/routeCrime.js";
import { RoutesNeighborhoodCrime } from "./route/routeNeighborhoodCrime.js";
import { RoutesNeighborhoodCrimeAdmin } from "./route/routeNeighborhoodCrimeAdmin.js";
import { RoutesAuditoryNeighborhoodCrime } from "./route/routeAuditoryNeighborhoodCrime.js";
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
import { reviewNewsCrimesToUpdate } from "./controller/neighborhoodCrime/neighborhoodCrimeController.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.LOCALHOST_FRONTEND, credentials: true }));
app.use(cookieParser());

try {
  if (!process.env.PORT) throw "PORT not declared";

  app.listen(process.env.PORT, () => {
    console.log("Listening in http://localhost:" + process.env.PORT);
  });
} catch (error) {
  console.log("Internal server error:", error.message);
  process.exit(1);
}

cron.schedule("0 0 6 1 * *", async () => {
  try {
    await reviewNewsCrimesToUpdate();
  } catch (error) {
    console.log("Error to update neighborhoods crimes data:", error.message);
  }
});

app.post("/sendConsultation/", sendConsultation);
app.use("/crime/", RoutesCrime);
app.use("/neighborhoodCrime/", RoutesNeighborhoodCrime);

app.use("/admin/login/", RoutesLogin);
app.use("/admin/profile/", RoutesProfile);
app.use("/admin/logout/", RoutesLogout);
app.use("/admin/confirmEmail/", RoutesConfirmEmail);
app.use("/admin/neighborhood/", RoutesNeighbordhood);
app.use("/admin/crime/", RoutesCrimeAdmin);
app.use("/admin/neighborhoodCrime/", RoutesNeighborhoodCrimeAdmin);
app.use("/admin/department/", RoutesDepartment);
app.use("/admin/population/", RoutesPopulation);
app.use("/admin/role/", RoutesRol);
app.use("/admin/auditoryNeighborhoodCrime/", RoutesAuditoryNeighborhoodCrime);
app.use("/admin/user/", RoutesUser);

app.use("/", (req, res) => {
  return res.status(200).send("Servidor corriendo");
});
