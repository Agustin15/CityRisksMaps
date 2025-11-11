import { connection } from "../config/connection.js";
import sql from "mssql";

export class QuizDAL {
  async add(quiz) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), quiz.propEmail);
      request.input("neighbordhood", sql.VarChar(30), quiz.propNeighbordhood);
      request.input("secure", sql.Bit, quiz.propSecure);

      const result = await request.execute("AddQuiz");

      switch (result.returnValue) {
        case -1:
          throw new Error("Correo invalido", { cause: { code: 400 } });
        case -2:
          throw new Error("No hay registro de un barrio con nombre", {
            cause: { code: 404 }
          });
        case -3:
          throw new Error("Error inesperado al agregar encuesta", {
            cause: { code: 502 }
          });
      }
      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update(quiz) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), quiz.propEmail);
      request.input("neighbordhood", sql.VarChar(30), quiz.propNeighbordhood);
      request.input("secure", sql.Bit, quiz.propSecure);

      const result = await request.execute("UpdateQuiz");

      if (result.returnValue == -1)
        throw new Error("Correo invalido", {
          cause: { code: 400 }
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

  async delete(quiz) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), quiz.propEmail);
      request.input("neighbordhood", sql.VarChar(30), quiz.propNeighbordhood);
      request.input("quizDate", sql.Date, quiz.propQuizDate);

      const result = await request.execute("DeleteQuiz");

      if (result.returnValue == -1)
        throw new Error(
          "No hay registro de una encuesta en este con este corre,en este barrio y este año",
          {
            cause: { code: 404 }
          }
        );
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar encuesta", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getQuizesByNeighbordhoodAndYear(quiz, year) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("neighbordhood", sql.VarChar(30));
      ps.input("year", sql.Int);

      const result = await ps.prepare(
        "select * from Quizes where neighbordhood=@neighbordhood and YEAR(quizDate)=@year"
      );

      await ps.execute({
        neighbordhood: quiz.propNeighbordhood,
        year: parseInt(year)
      });

      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
