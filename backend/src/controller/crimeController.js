import { Crime } from "../entity/crime.js";
import { CrimeService } from "../service/crimeService.js";

export const add = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    const { category, description } = req.body;

    const crime = new Crime(category, description);

    await CrimeService.add(crime);

    res.status(200).json(true);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    if (decodeURIComponent(req.params.category) == null)
      throw new Error("Categoria no definida");

    const category = decodeURIComponent(req.params.category);
    const { description } = req.body;

    const crime = new Crime(category, description);

    await CrimeService.update(crime);

    res.status(200).json(true);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
export const deleteByCategory = async (req, res) => {
  try {
    if (decodeURIComponent(req.params.category) == null)
      throw new Error("Categoria no definida");

    const category = decodeURIComponent(req.params.category);

    await CrimeService.delete(category);

    res.status(200).json(true);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getAllTypeCrimes = async (req, res) => {
  try {
    const crimes = await CrimeService.getAllTypeCrimes();

    if (crimes.length == 0)
      throw new Error("No se encontraron categorias de crimenes en el sistema");

    res.status(200).json(crimes);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
