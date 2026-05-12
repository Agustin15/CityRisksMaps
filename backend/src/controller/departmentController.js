import { DepartmentService } from "../service/departmentService.js";
import { Department } from "../entity/department.js";

export const add = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    const { name } = req.body;

    const department = new Department();
    department.name = name;

    await DepartmentService.add(department);

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    if (req.params.idDepartment == null) throw new Error("Debe indicar un id");

    const idDepartment = req.params.idDepartment;
    const { name } = req.body;

    const department = new Department();
    department.idDepartment = parseInt(idDepartment);
    department.name = name;

    await DepartmentService.update(department);

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    if (req.params.idDepartment == null)
      throw new Error("Debe indicar un departmento a eliminar");

    const idDepartment = parseInt(req.params.idDepartment);

    await DepartmentService.delete(idDepartment);

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await DepartmentService.getDepartments();

    if (departments.length == 0)
      throw new Error(
        "No se encontraron registros de departamentos en el sistema"
      );

    return res.status(200).json(departments);
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};

export const getDepartmentsOffset = async (req, res) => {
  try {
    if (req.params.offset == null) throw new Error("Debe indicar un offset");

    const offset = parseInt(req.params.offset);

    const departments = await DepartmentService.getDepartments();

    if (departments.length == 0)
      throw new Error(
        "No se encontraron registros de departamentos en el sistema"
      );

    const departmentsOffset =
      await DepartmentService.getDepartmentsOffset(offset);

    if (departmentsOffset.length == 0)
      throw new Error(
        "No se encontraron registros de departamentos en el sistema"
      );

    return res.status(200).json({
      registersOffset: departmentsOffset,
      pages: Math.ceil(departments.length / 10)
    });
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    if (req.params.idDepartment == null) throw new Error("Debe indicar un id");

    const idDepartment = parseInt(req.params.idDepartment);

    const department = await DepartmentService.getDepartmentById(idDepartment);

    if (!department)
      throw new Error(
        "No se encontro el registo de departamento en el sistema"
      );

    return res.status(200).json(department);
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};
