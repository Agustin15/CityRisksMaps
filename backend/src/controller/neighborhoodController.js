import { NeighborhoodService } from "../service/neighborhoodService.js";
import { Neighborhood } from "../entity/neighborhood.js";
import { Department } from "../entity/department.js";

export const add = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de la solicitud no definido");

    const { name, idDepartment } = req.body;

    const department = new Department(parseInt(idDepartment));
    const neighborhood = new Neighborhood(0, name, department);

    await NeighborhoodService.add(neighborhood);

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de la solicitud no definido");
    if (req.params.idNeighborhood == null)
      throw new Error("Debe indicar un nombre");

    const { name, idDepartment } = req.body;
    const idNeighborhood = parseInt(req.params.idNeighborhood);

    const department = new Department(parseInt(idDepartment));
    const neighborhood = new Neighborhood(idNeighborhood, name, department);

    await NeighborhoodService.update(neighborhood);

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    if (req.params.idNeighborhood == null)
      throw new Error("Debe indicar un barrio a eliminar");

    const idNeighborhood = parseInt(req.params.idNeighborhood);

    await NeighborhoodService.delete(idNeighborhood);

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getNeighborhoods = async (req, res) => {
  try {
    const neighbordhoods = await NeighborhoodService.getNeighborhoods();

    if (neighbordhoods.length == 0)
      throw new Error("No se encontraron registros de barrios en el sistema");

    return res.status(200).json(neighbordhoods);
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};

export const getNeighborhoodsOffset = async (req, res) => {
  try {
    if (req.params.offset == null) throw new Error("Debe indicar un offset");

    const offset = parseInt(req.params.offset);

    const neighbordhoods = await NeighborhoodService.getNeighborhoods();

    if (neighbordhoods.length == 0)
      throw new Error("No se encontraron registros de barrios en el sistema");

    const neighbordhoodsOffset =
      await NeighborhoodService.getNeighborhoodsOffset(offset);

    if (neighbordhoodsOffset.length == 0)
      throw new Error("No se encontraron registros de barrios en el sistema");

    return res.status(200).json({
      registersOffset: neighbordhoodsOffset,
      pages: Math.ceil(neighbordhoods.length / 10)
    });
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};

export const getNeighborhoodsByDepartmentOffset = async (req, res) => {
  try {
    if (req.params.offset == null) throw new Error("Debe indicar un offset");

    if (req.params.nameDepartment == null)
      throw new Error("Debe indicar el departamento");

    const offset = parseInt(req.params.offset);
    const nameDepartment = decodeURIComponent(req.params.nameDepartment);

    const neighbordhoods =
      await NeighborhoodService.getNeighborhoodsByDepartment(nameDepartment);

    if (neighbordhoods.length == 0)
      throw new Error(
        "No se encontraron registros de barrios en este departamento en el sistema"
      );

    const neighbordhoodsOffset =
      await NeighborhoodService.getNeighborhoodsByDepartmentOffset(
        nameDepartment,
        offset
      );

    if (neighbordhoodsOffset.length == 0)
      throw new Error(
        "No se encontraron registros de barrios en este departamento en el sistema"
      );

    return res.status(200).json({
      registersOffset: neighbordhoodsOffset,
      pages: Math.ceil(neighbordhoods.length / 10)
    });
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};
