import { NeighborhoodService } from "../service/neighborhoodService.js";
import { Neighborhood } from "../entity/neighborhood.js";
import { Department } from "../entity/department.js";

export const getNeighborhoods = async (req, res) => {
  try {
    const neighbordhoods = await NeighborhoodService.getNeighborhoods();

    if (neighbordhoods.length == 0)
      throw new Error("No se encontraron registros de barrios en el sistema");

    res.status(200).json(neighbordhoods);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getNeighborhoodsOffset = async (req, res) => {
  try {
    if (!JSON.parse(req.params.paramsGet).offset == null)
      throw new Error("Debe indicar un offset");

    const offset = JSON.parse(req.params.paramsGet).offset;

    const neighbordhoods =
      await NeighborhoodService.getNeighborhoodsOffset(offset);

    if (neighbordhoods.length == 0)
      throw new Error("No se encontraron registros de barrios en el sistema");

    res.status(200).json(neighbordhoods);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const add = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de la solicitud no definido");

    const { name, idDepartment } = req.body;

    const department = new Department(parseInt(idDepartment));
    const neighborhood = new Neighborhood(name, department);

    await NeighborhoodService.add(neighborhood);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de la solicitud no definido");
    if (!req.params.name) throw new Error("Debe indicar un nombre");

    const { name, idDepartment } = req.body;

    const department = new Department(parseInt(idDepartment));
    const neighborhood = new Neighborhood(name, department);

    await NeighborhoodService.update(neighborhood);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const deleteByName = async (req, res) => {
  try {
    if (!req.params.name) throw new Error("Debe indicar un nombre");

    const name = req.params.name;

    await NeighborhoodService.delete(name);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};
