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

      const result = await request.execute("DeleteQuiz");

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
