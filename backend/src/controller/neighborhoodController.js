import { NeighborhoodService } from "../service/neighborhoodService.js";
import { verifyAuthToken } from "./authentication.js";

export const getNeighborhoodsWithoutQuizByYear = async (req, res) => {
  try {
    const tokenDecoded = verifyAuthToken(req.cookies.authToken);
    
    const { year } = JSON.parse(req.params.optionGet);

    if (!year) throw new Error("Debe indicar un año");

    const neighbordhoods =
      await NeighborhoodService.getNeighborhoodsWithoutQuizByYear(
        year,
        tokenDecoded.email
      );

    if (neighbordhoods.length > 0)
      neighbordhoods.unshift({ name: "Seleccionar" });

    res.status(200).json(neighbordhoods);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
