import { NeighborhoodCrimeDAL } from "../dataAccess/neighborhoodCrimeDAL.js";

const neighborhoodCrimeDAL = new NeighborhoodCrimeDAL();

export const getNeighborhoodsCrimeByYear = async (req, res) => {
  try {
    const { year, categoryCrime } = JSON.parse(req.params.optionGet);

    if (!year) throw new Error("Año no definido", { cause: { code: 400 } });
    if (!categoryCrime)
      throw new Error("Categoria no definida", { cause: { code: 400 } });

    const neighborhoodsCrimes =
      await neighborhoodCrimeDAL.getNeighborhoodsCrimeByYear(
        categoryCrime,
        year
      );

    res.status(200).json(neighborhoodsCrimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getYearsNeighborhoodsCrime = async (req, res) => {
  try {
    const { categoryCrime } = JSON.parse(req.params.optionGet);

    if (!categoryCrime)
      throw new Error("Categoria no definida", { cause: { code: 400 } });

    const yearsNeighborhoodsCrimes =
      await neighborhoodCrimeDAL.getYearsNeighborhoodsCrime(categoryCrime);

    res.status(200).json(yearsNeighborhoodsCrimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
