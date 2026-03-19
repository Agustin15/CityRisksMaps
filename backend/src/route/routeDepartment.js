import express from "express";
import { verifyAuthToken } from "../controller/authentication.js";
import {
  add,
  deleteById,
  update,
  getDepartmentById,
  getDepartments,
  getDepartmentsOffset
} from "../controller/departmentController.js";

export const RoutesDepartment = express.Router();

RoutesDepartment.use(verifyAuthToken);

RoutesDepartment.get("/:paramsGet", (req, res) => {
  if (!req.params) throw new Error("Parametros de solicitud no definidos");

  const { option } = JSON.parse(req.params.paramsGet);

  switch (option) {
    case "getDepartments":
      return getDepartments(req, res);
    case "getDepartmentsOffset":
      return getDepartmentsOffset(req, res);
    case "getDepartmentsById":
      return getDepartmentById(req, res);
  }
});

RoutesDepartment.post("/", add);
RoutesDepartment.put("/:idDepartment", update);
RoutesDepartment.delete("/:idDepartment", deleteById);
