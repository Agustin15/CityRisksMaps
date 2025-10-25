import dotenv from "dotenv";
import express from "express";
import { connection } from "./config/connection.js";
import { DepartmentDAL } from "./dataAccess/departmentDAL.js";

const departmentDAL = new DepartmentDAL();
dotenv.config();

const app = express();

app.use(express.json());

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
