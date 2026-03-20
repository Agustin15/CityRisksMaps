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
  if (!req.params) res.status(400).send("Parametros de solicitud no definidos");

  if (!JSON.parse(req.params.paramsGet))
    res.status(400).send("paramsGet no definido");

  const { option } = JSON.parse(req.params.paramsGet);

  if (!option) res.status(400).send("option no definido");

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
