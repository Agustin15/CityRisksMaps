import { connection } from "../config/connection.js";
import sql from "mssql";
import { QuizCrimeDAL } from "./quizCrimeDAL.js";

export class QuizDAL {
  static async add(quiz, transaction) {
    try {
      const request = new sql.Request(transaction);

      request.input("participant", sql.VarChar(30), quiz.participant.email);
      request.input("neighborhood", sql.VarChar(30), quiz.neighborhood.name);
      request.input("secure", sql.Bit, quiz.secure);

      const result = await request.execute("AddQuiz");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No hay registro de un participante con este correo en el sistema",
            {
              cause: { code: 400 }
            }
          );

        case -2:
          throw new Error("No hay registro de un barrio con nombre", {
            cause: { code: 404 }
          });
        case -3:
          throw new Error(
            "Ya tiene registrada una encuesta en este barrio y en este año",
            {
              cause: { code: 409 }
            }
          );
        case -4:
          throw new Error("Error inesperado al agregar encuesta", {
            cause: { code: 502 }
          });
      }
      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async update(quiz) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idQuiz", sql.Int, quiz.idQuiz);
      request.input("secure", sql.Bit, quiz.secure);

      const result = await request.execute("UpdateQuiz");

      if (result.returnValue == -1)
        throw new Error("Encuesta no encontrada", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al actualizar encuesta", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async delete(idQuiz) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idQuiz", sql.Int, idQuiz);

      const result = await request.execute("DeleteQuiz");

      if (result.returnValue == -1)
        throw new Error("No hay registro de esta encuesta en el sistema", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar encuesta", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  static async getQuizesYears() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare(
        "select DISTINCT Year(quizDate) as year from Quizes ORDER BY Year(quizDate)"
      );

      const result = await ps.execute();

      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getQuizesNeighbordhoodByYear(year) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("year", sql.Int, year);

      const result = await request.execute("QuizesNeighbordhoodByYear");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getSecurityPercentagesInNeighborhood(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("neighborhood", sql.VarChar(30), neighbordhood);

      const result = await request.execute("QuizQuantitySecureInNeighborhood");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getYearsOfParticipantQuizes(participant) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("participant", sql.VarChar(30), participant);

      const result = await request.execute("YearsOfParticipantQuizes");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getQuizesByParticipantAndYear(participant, year) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("participant", sql.VarChar(30), participant);
      request.input("year", sql.Int, year);

      const result = await request.execute("QuizesByParticipantAndYear");

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
  static async getLimitQuizesByParticipantAndYear(participant, year, offset) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("participant", sql.VarChar(30), participant);
      request.input("year", sql.Int, year);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("QuizesLimitByParticipantAndYear");

      if (result.recordset.length > 0) {
        for (const quiz of result.recordset) {
          const crimesQuiz = await QuizCrimeDAL.getQuizCrimesById(quiz.idQuiz);
          quiz["crimesQuiz"] = crimesQuiz;
        }
      }

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
