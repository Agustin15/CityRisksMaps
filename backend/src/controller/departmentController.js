import { DepartmentService } from "../service/departmentService.js";
import { Department } from "../entity/department.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await DepartmentService.getDepartments();

    if (departments.length == 0)
      throw new Error(
        "No se encontraron registros de departamentos en el sistema"
      );

    res.status(200).json(departments);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getDepartmentsOffset = async (req, res) => {
  try {
    if (!JSON.parse(req.params.paramsGet).offset == null)
      throw new Error("Debe indicar un offset");

    const offset = JSON.parse(req.params.paramsGet).offset;

    const departmentsOffset =
      await DepartmentService.getDepartmentsOffset(offset);

    if (departmentsOffset.length == 0)
      throw new Error(
        "No se encontraron registros de departamentos en el sistema"
      );

    res.status(200).json(departmentsOffset);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    if (!JSON.parse(req.params.paramsGet).id)
      throw new Error("Debe indicar un id");

    const idDepartment = JSON.parse(req.params.paramsGet).idDepartment;

    const department = await DepartmentService.getDepartmentById(idDepartment);

    if (!department)
      throw new Error(
        "No se encontro el registo de departamento en el sistema"
      );

    res.status(200).json(department);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const add = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    const { name } = JSON.parse(req.body);

    const department = new Department();
    department.name = name;

    await DepartmentService.add(department);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    if (!JSON.parse(req.params.paramsGet).id)
      throw new Error("Debe indicar un id");

    const idDepartment = JSON.parse(req.params.paramsGet).idDepartment;
    const { name } = JSON.parse(req.body);

    const department = new Department();
    department.idDepartment = idDepartment;
    department.name = name;

    await DepartmentService.update(department);

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    if (!JSON.parse(req.params.paramsGet).id)
      throw new Error("Debe indicar un id");

    const idDepartment = JSON.parse(req.params.paramsGet).id;

    await DepartmentService.delete(idDepartment);

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
