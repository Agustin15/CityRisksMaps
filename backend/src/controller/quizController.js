import { Quiz } from "../model/quiz.js";

export const getQuizesYears = async (req, res) => {
  const quiz = new Quiz();

  try {
    const years = await quiz.getQuizesYears();
    res.status(200).json(years);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getQuizesByNeighbordhoodAndYear = async (req, res) => {
  const { year, neighborhood } = JSON.parse(req.params.optionGet);

  const quiz = new Quiz();
  quiz.propNeighborhood = neighborhood;

  try {
    const quizes = await quiz.getQuizesByNeighbordhoodAndYear(year);

    res.status(200).json(quizes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
