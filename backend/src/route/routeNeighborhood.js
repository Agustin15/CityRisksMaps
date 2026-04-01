import express from "express";
import {
  getNeighborhoodsByDepartmentOffset,
  getNeighborhoodsOffset,
  getNeighborhoods,
  add,
  update,
  deleteById
} from "../controller/neighborhoodController.js";
import { verifyAuthToken } from "../controller/authentication.js";
import { verifyAuthorization } from "../controller/authorization.js";

export const RoutesNeighbordhood = express.Router();

RoutesNeighbordhood.use(verifyAuthToken);

RoutesNeighbordhood.get("/allNeighborhoods", getNeighborhoods);
RoutesNeighbordhood.get("/neighborhoodsOffset/:offset", getNeighborhoodsOffset);
RoutesNeighbordhood.get(
  "/neighborhoodsOffsetDepartment/:nameDepartment/:offset",
  getNeighborhoodsByDepartmentOffset
);

RoutesNeighbordhood.post("/", verifyAuthorization, add);
RoutesNeighbordhood.put("/:idNeighborhood", verifyAuthorization, update);
RoutesNeighbordhood.delete("/:idNeighborhood", verifyAuthorization, deleteById);
