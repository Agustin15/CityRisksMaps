import { CrimeService } from "../service/crimeService.js";

export const getCrimesTypeOptions = async (req, res) => {
  try {
    const crimes = await CrimeService.getCrimesTypeOptions();

    if (crimes && crimes.length == 0)
      throw new Error(
        "No se encontraron registros de estas categorias de crimenes"
      );

    res.status(200).json(crimes);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getAllTypeCrimes = async (req, res) => {
  try {
    const crimes = await CrimeService.getAllTypeCrimes();

    if (crimes && crimes.length == 0)
      throw new Error("No se encontraron categorias de crimenes en el sistema");

    res.status(200).json(crimes);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
