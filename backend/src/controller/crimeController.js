import { Crime } from "../model/crime.js";

export const getCrimes = async (req, res) => {
  try {
    const crime = new Crime();
    const crimes = await crime.getCrimes();

    if (crimes.length == 0)
      throw new Error("No hay registros de categorias de crimenes");

    res.status(200).json(crimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
