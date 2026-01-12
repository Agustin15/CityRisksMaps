import { verifyAuthToken } from "./authentication.js";
import { DepartmentService } from "../service/departmentService.js";
import { Neighborhood } from "../entity/neighborhood.js";
import { Quiz } from "../entity/quiz.js";
import { NeighborhoodService } from "../service/neighborhoodService.js";
import { QuizService } from "../service/quizService.js";
import { Department } from "../entity/department.js";
import { QuizCrimeService } from "../service/quizCrimeService.js";
import { CrimeService } from "../service/crimeService.js";
import { Participant } from "../entity/participant.js";
import { connection } from "../config/connection.js";
import sql from "mssql";

export const add = async (req, res) => {
  let transaction;
  try {
    verifyAuthToken(req.cookies.authToken);

    const { email, neighborhoodSelected, perception, reasons } = req.body;
    let crimesMapping;

    const participant = new Participant(email);

    if (reasons.length > 0) {
      crimesMapping = await CrimeService.validAndMappingCrimes(reasons);
    }
    const neighbordhoodFound = await NeighborhoodService.getNeighborhoodByName(
      neighborhoodSelected
    );

    if (!neighbordhoodFound)
      throw new Error("No se encontro un barrio con este nombre");

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

export const deleteQuiz = async (req, res) => {
  try {
    verifyAuthToken(req.cookies.authToken);
    const { idQuiz } = req.params;

    if (!idQuiz) throw new Error("Debe indicar un encuesta a eliminar");

    await QuizService.delete(idQuiz);

    res.status(200).json(true);
  } catch (error) {
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

export const getSecurityPercentagesInNeighborhood = async (req, res) => {
  try {
    const { neighborhood } = JSON.parse(req.params.optionGet);

    if (!neighborhood)
      throw new Error("Debe ingresar un barrio  para la busqueda");

    const quizesSecurityPercentages =
      await QuizService.getSecurityPercentagesInNeighborhood(neighborhood);

    if (quizesSecurityPercentages.length == 0)
      throw new Error(
        "No hay registros de encuestas de este barrio en el sistema"
      );

    res.status(200).json(quizesSecurityPercentages);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getYearsOfParticipantQuizes = async (req, res) => {
  try {
    verifyAuthToken(req.cookies.authToken);
    const { participantEmail } = JSON.parse(req.params.optionGet);

    if (!participantEmail)
      throw new Error("Debe ingresar un correo para la busqueda");

    const years = await QuizService.getYearsOfParticipantQuizes(
      participantEmail
    );

    if (years.length == 0)
      throw new Error(
        "No se encontraron registros de encuestas con este correo"
      );

    res.status(200).json(years);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getQuizesByParticipantAndYear = async (req, res) => {
  try {
    verifyAuthToken(req.cookies.authToken);

    const { participantEmail, year } = JSON.parse(req.params.optionGet);

    if (!participantEmail)
      throw new Error("Debe ingresar un correo para la busqueda");

    if (!year) throw new Error("Debe ingresar un año para la busqueda");

    const quizes = await QuizService.getQuizesByParticipantAndYear(
      participantEmail,
      year
    );

    if (quizes.length == 0)
      throw new Error(
        "No se encontraron registros de encuestas con este correo y este año"
      );

    res.status(200).json(quizes);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getLimitQuizesByParticipantAndYear = async (req, res) => {
  try {
    verifyAuthToken(req.cookies.authToken);
    const { participantEmail, year, offset } = JSON.parse(req.params.optionGet);

    if (!participantEmail)
      throw new Error("Debe ingresar un correo para la busqueda");

    if (!year) throw new Error("Debe ingresar un año para la busqueda");

    if (typeof offset != "number") throw new Error("Indice no indicado");

    const quizes = await QuizService.getLimitQuizesByParticipantAndYear(
      participantEmail,
      year,
      offset
    );

    if (quizes.length == 0)
      throw new Error("No se encontraron registros de encuestas");

    res.status(200).json(quizes);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
