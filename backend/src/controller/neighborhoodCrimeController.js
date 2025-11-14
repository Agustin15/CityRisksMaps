import { NeighborhoodCrime } from "../model/neighborhoodCrime.js";

export const getNeighborhoodsCrimeByYear = async (req, res) => {
  try {
    const { year, categoryCrime } = JSON.parse(req.params.optionGet);

    const neighborhoodCrime = new NeighborhoodCrime();

    neighborhoodCrime.propCrime = categoryCrime;
    neighborhoodCrime.propYear = year;

    const neighborhoodsCrimes =
      await neighborhoodCrime.getNeighborhoodsCrimeByYear();

    if (neighborhoodsCrimes && neighborhoodCrime.length == 0)
      throw new Error("No hay registros de crimenes en barrios en este año");

    res.status(200).json(neighborhoodsCrimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getYearsNeighborhoodsCrime = async (req, res) => {
  try {
    const { categoryCrime } = JSON.parse(req.params.optionGet);

    const neighborhoodCrime = new NeighborhoodCrime();

    neighborhoodCrime.propCrime = categoryCrime;

    const yearsNeighborhoodsCrimes =
      await neighborhoodCrime.getYearsNeighborhoodsCrime();

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

    const neighborhoodCrime = new NeighborhoodCrime();

    neighborhoodCrime.propNeighborhood = neighborhood;
    neighborhoodCrime.propCrime = categoryCrime;

    const categoryCrimeInNeighborhood =
      await neighborhoodCrime.getCategoryCrimeInNeighborhood();

    if (categoryCrimeInNeighborhood && categoryCrimeInNeighborhood.length == 0)
      throw new Error("No hay registros de este crimen en este barrio");

    return res.status(200).json(categoryCrimeInNeighborhood);
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};
