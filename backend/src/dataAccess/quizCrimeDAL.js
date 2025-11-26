import { connection } from "../config/connection.js";
import sql from "mssql";

export class QuizCrimeDAL {
  static async add(quizCrime, transaction) {
    try {
      const request = new sql.Request(transaction);

      request.input("idQuiz", sql.Int, quizCrime.quiz.idQuiz);
      request.input("crime", sql.VarChar, quizCrime.crime.category);

      const result = await request.execute("AddQuizCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No hay registro de una encuesta con ID en el sistema",
            {
              cause: { code: 404 }
            }
          );
        case -2:
          throw new Error(
            "No hay registro de un crimen de esta categoria en el sistema",
            {
              cause: { code: 404 }
            }
          );

        case -3:
          throw new Error(
            "Ya hay registro de este crimen en esta encuesta en el sistema",
            {
              cause: { code: 409 }
            }
          );
        case -4:
          throw new Error("Error inesperado al agregar crimen de la encuesta", {
            cause: { code: 502 }
          });
      }

      return result.returnValue;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async delete(idQuiz, category) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idQuiz", sql.Int, idQuiz);
      request.input("crime", sql.VarChar, category);

      const result = await request.execute("DeleteQuizCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No hay registro de este crimen en esta encuesta en el sistema",
            {
              cause: { code: 404 }
            }
          );

        case -1:
          throw new Error(
            "Error inesperado al eliminar crimen de la encuesta",
            {
              cause: { code: 502 }
            }
          );
      }

      return result.returnValue;
    } catch (error) {
      throw new Error(error);
    }
  }
}
