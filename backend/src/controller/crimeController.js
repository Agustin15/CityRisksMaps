import { CrimeDAL } from "../dataAccess/crimeDAL.js";

const crimeDAL = new CrimeDAL();

export const getCrimes = async (req, res) => {
  try {
    const crimes = await crimeDAL.getCrimes();

    res.status(200).json(crimes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
