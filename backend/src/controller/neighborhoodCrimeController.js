import { NeighborhoodCrime } from "../model/neighborhoodCrime.js";

export const getNeighborhoodsCrimeByYear = async (req, res) => {
  try {
    const { year, categoryCrime } = JSON.parse(req.params.optionGet);

    if (!year) throw new Error("Año no definido", { cause: { code: 400 } });
    if (!categoryCrime)
      throw new Error("Categoria no definida", { cause: { code: 400 } });

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

    if (!categoryCrime)
      throw new Error("Categoria no definida", { cause: { code: 400 } });

    const neighborhoodCrime = new NeighborhoodCrime();

    neighborhoodCrime.propCrime = categoryCrime;

    const yearsNeighborhoodsCrimes =
      await neighborhoodCrime.getYearsNeighborhoodsCrime();

    res.status(200).json(yearsNeighborhoodsCrimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
