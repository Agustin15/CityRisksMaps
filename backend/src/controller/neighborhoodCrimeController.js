import { NeighborhoodCrime } from "../model/neighborhoodCrime.js";

export const getNeighborhoodsCrimeByYear = async (req, res) => {
  try {
    const { year, categoryCrime } = JSON.parse(req.params.optionGet);

    const neighborhoodCrime = new NeighborhoodCrime();

    neighborhoodCrime.propCrime = categoryCrime;
    neighborhoodCrime.propYear = year;

    const neighborhoodsCrimes =
      await neighborhoodCrime.getNeighborhoodsCrimeByYear();

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

    return res.status(200).json(categoryCrimeInNeighborhood);
  } catch (error) {
    return res.status(404).json({ messageError: error.message });
  }
};
