import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();

app.use(express.json());

try {
  if (!process.env.PORT) throw "PORT not declared";

  app.listen(process.env.PORT, () => {
    console.log("Listening in http://localhost:" + process.env.PORT);
  });
} catch (error) {
  console.log("Internal server error:", error);
  process.exit(1);
}
