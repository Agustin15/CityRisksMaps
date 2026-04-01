import { Rol } from "../entity/rol.js";
import { RolService } from "../service/rolService.js";

export const getRols = async (req, res) => {
  try {
    const rols = await RolService.getAllRols();

    if (rols.length == 0)
      throw new Error("No se encontraron registros de roles en en sistema");

    res.status(200).json(rols);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const add = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    const { name } = req.body;

    const rol = new Rol(0, name);

    await RolService.add(rol);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.params.idRol == null) throw new Error("Rol no indicado");

    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    const { name } = req.body;
    const idRol = parseInt(req.params.idRol);

    const rol = new Rol(idRol, name);
    
    await RolService.update(rol);

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    if (!req.params.idRol == null) throw new Error("Rol no indicado");

    const idRol = req.params.idRol;

    await RolService.delete(idRol);

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
