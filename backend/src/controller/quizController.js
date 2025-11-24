import { Quiz } from "../model/quiz.js";
import { QuizService } from "../service/quizService.js";

export const getQuizesYears = async (req, res) => {
  try {
    const years = await QuizService.getQuizesYears();

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

    if (!year) throw new Error("Debe ingresar un año para la busqueda");
    
    const quizes = await QuizService.getQuizesByNeighbordhoodAndYear(year);

    if (quizes && quizes.length == 0)
      throw new Error("No hay registro de encuestas en este año");
    res.status(200).json(quizes);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
