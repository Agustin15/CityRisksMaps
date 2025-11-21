import { Crime } from "../model/crime.js";

export const getCrimesTypeOptions = async (req, res) => {
  try {
    const crime = new Crime();
    const crimes = await crime.getCrimesTypeOptions();

    if (crimes && crimes.length == 0)
      throw new Error(
        "No se encontraron registros de estas categorias de crimenes"
      );

    res.status(200).json(crimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getAllTypeCrimes = async (req, res) => {
  try {
    const crime = new Crime();
    const crimes = await crime.getAllTypeCrimes();

    if (crimes && crimes.length == 0)
      throw new Error("No se encontraron categorias de crimenes en el sistema");

    res.status(200).json(crimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
