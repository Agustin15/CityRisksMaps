import { Crime } from "../model/crime.js";

export const getCrimes = async (req, res) => {
  try {
    const crime = new Crime();    
    const crimes = await crime.getCrimes();
    res.status(200).json(crimes);
  } catch (error) {
    console.log(error);
    res.status(404).json({ messageError: error.message });
  }
};
