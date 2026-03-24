import express from "express";
import {
  getNeighborhoodsByIdDepartmentOffset,
  getNeighborhoodsOffset,
  getNeighborhoods,
  add,
  update,
  deleteById
} from "../controller/neighborhoodController.js";
import { verifyAuthToken } from "../controller/authentication.js";

export const RoutesNeighbordhood = express.Router();

RoutesNeighbordhood.use(verifyAuthToken);

RoutesNeighbordhood.get("/:paramsGet", (req, res) => {
  if (!req.params) res.status(400).send("Parametros de solicitud no definidos");

  if (!JSON.parse(req.params.paramsGet))
    res.status(400).send("paramsGet no definido");

  const { option } = JSON.parse(req.params.paramsGet);

  if (!option) res.status(400).send("option no definido");

  switch (option) {
    case "getNeighborhoods":
      return getNeighborhoods(req, res);
    case "getNeighborhoodsOffset":
      return getNeighborhoodsOffset(req, res);
    case "getNeighborhoodsByIdDepartmentOffset":
      return getNeighborhoodsByIdDepartmentOffset(req, res);
  }
});

RoutesNeighbordhood.post("/", add);
RoutesNeighbordhood.put("/:idNeighborhood", update);
RoutesNeighbordhood.delete("/:idNeighborhood", deleteById);
