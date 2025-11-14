import { Quiz } from "../model/quiz.js";

export const getQuizesYears = async (req, res) => {
  try {
    const quiz = new Quiz();
    const years = await quiz.getQuizesYears();

    if (years && years.length == 0)
      throw new Error("No hay años registrados de encuestas");

    res.status(200).json(years);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getQuizesNeighbordhoodByYear = async (req, res) => {
  try {
    const { year } = JSON.parse(req.params.optionGet);

    const quiz = new Quiz();
    const quizes = await quiz.getQuizesByNeighbordhoodAndYear(year);

    if (quizes && quizes.length == 0)
      throw new Error("No hay registro de encuestas en este año");
    res.status(200).json(quizes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
