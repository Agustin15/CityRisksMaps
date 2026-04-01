import express from "express";
import { verifyAuthToken } from "../controller/authentication.js";
import { verifyAuthorization } from "../controller/authorization.js";
import {
  add,
  deleteById,
  update,
  getDepartmentById,
  getDepartmentsOffset,
  getDepartments
} from "../controller/departmentController.js";

export const RoutesDepartment = express.Router();

RoutesDepartment.use(verifyAuthToken);

RoutesDepartment.get("/allDepartments", getDepartments);
RoutesDepartment.get("/departmentsOffset/:offset", getDepartmentsOffset);
RoutesDepartment.get("/departmentById/:id", getDepartmentById);

RoutesDepartment.post("/", verifyAuthorization, add);
RoutesDepartment.put("/:idDepartment", verifyAuthorization, update);
RoutesDepartment.delete("/:idDepartment", verifyAuthorization, deleteById);
