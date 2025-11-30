import { DepartmentService } from "../service/departmentService.js";
import { Neighborhood } from "../model/neighborhood.js";
import { Quiz } from "../model/quiz.js";
import { NeighborhoodService } from "../service/neighborhoodService.js";
import { QuizService } from "../service/quizService.js";
import { Department } from "../model/department.js";
import { QuizCrimeService } from "../service/quizCrimeService.js";
import { CrimeService } from "../service/crimeService.js";
import { Participant } from "../model/participant.js";
import { connection } from "../config/connection.js";
import sql from "mssql";

export const add = async (req, res) => {
  let transaction;
  try {
    const { email, neighborhoodSelected, perception, reasons } = req.body;
    let crimesMapping;

    const participant = new Participant(email);

    if (reasons.length > 0) {
      crimesMapping = await CrimeService.validAndMappingCrimes(reasons);
    }
    const neighbordhoodFound = await NeighborhoodService.getNeighborhoodByName(
      neighborhoodSelected
    );

    const departmentFound = await DepartmentService.getDepartmentById(
      neighbordhoodFound.department
    );
    const department = new Department(
      departmentFound.idDepartment,
      departmentFound.name
    );

    const neighborhood = new Neighborhood(neighbordhoodFound.name, department);

    const quiz = new Quiz();

    quiz.participant = participant;
    quiz.secure = perception;
    quiz.neighborhood = neighborhood;

    transaction = new sql.Transaction(connection.pool);
    await transaction.begin(4);

    const idQuizAdded = await QuizService.add(quiz, transaction);

    if (crimesMapping) {
      quiz.idQuiz = idQuizAdded;
      await QuizCrimeService.add(quiz, crimesMapping, transaction);
    }

    await transaction.commit();

    res.status(200).json(true);
  } catch (error) {
    if (transaction) await transaction.rollback();

    res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const getQuizesYears = async (req, res) => {
  try {
    const years = await QuizService.getQuizesYears();

    if (years && years.length == 0)
      throw new Error("No hay años registrados de encuestas");

    res.status(200).json(years);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
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
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
