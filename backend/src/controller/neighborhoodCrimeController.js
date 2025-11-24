import { NeighborhoodCrimeService } from "../service/neighborhoodCrimeService.js";

export const getNeighborhoodsCrimeByYear = async (req, res) => {
  try {
    const { year, categoryCrime } = JSON.parse(req.params.optionGet);

    if (!year) throw new Error("Debe ingresar un año para la busqueda");
    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    const neighborhoodsCrimes =
      await NeighborhoodCrimeService.getNeighborhoodsCrimeByYear(
        categoryCrime,
        year
      );

    if (neighborhoodsCrimes.length == 0)
      throw new Error("No hay registros de crimenes en barrios en este año");

    res.status(200).json(neighborhoodsCrimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getYearsNeighborhoodsCrime = async (req, res) => {
  try {
    const { categoryCrime } = JSON.parse(req.params.optionGet);

    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    const yearsNeighborhoodsCrimes =
      await NeighborhoodCrimeService.getYearsNeighborhoodsCrime(categoryCrime);

    if (yearsNeighborhoodsCrimes && yearsNeighborhoodsCrimes.length == 0)
      throw new Error("No hay registros de años de crimenes en barrios");

    res.status(200).json(yearsNeighborhoodsCrimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getCategoryCrimeInNeighborhood = async (req, res) => {
  try {
    const { categoryCrime, neighborhood } = JSON.parse(req.params.optionGet);

    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    if (!neighborhood)
      throw new Error("Debe ingresar un barrio para la busqueda");

    const categoryCrimeInNeighborhood =
      await NeighborhoodCrimeService.getCategoryCrimeInNeighborhood(
        categoryCrime,
        neighborhood
      );

    if (categoryCrimeInNeighborhood && categoryCrimeInNeighborhood.length == 0)
      throw new Error("No hay registros de este crimen en este barrio");

    return res.status(200).json(categoryCrimeInNeighborhood);
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};
