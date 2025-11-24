import { connection } from "../config/connection.js";
import sql from "mssql";

export class QuizCrimeDAL {
  static async add(quiz, crimes) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idQuiz", sql.Int, quiz.idQuiz);
      request.input("crime", sql.VarChar, crimes);

      const result = await request.execute("AddQuizCrime");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "No hay registro de una encuesta con ID en el sistema",
            {
              cause: { code: 400 }
            }
          );

        case -2:
          throw new Error("Debe indicar al menos un crimen", {
            cause: { code: 400 }
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
              cause: { code: 400 }
            }
          );

        case -2:
          throw new Error("Debe indicar al menos un crimen", {
            cause: { code: 400 }
          });
      }

      return result.returnValue;
    } catch (error) {
      throw new Error(error);
    }
  }
}
