import { connection } from "../config/connection.js";
import { Quiz } from "../model/quiz.js";
import sql from "mssql";

export class quizDAL {
  async add(email, nameNeighbordhood, secure) {
    try {
      const quiz = new Quiz();

      quiz.propEmail = email;
      quiz.propSecure = secure;
      quiz.propNeighborhood = nameNeighbordhood;

      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), quiz.propEmail);
      request.input("neighbordhood", sql.VarChar(30), quiz.propNeighborhood);
      request.input("secure", sql.Bit, quiz.propSecure);

      const result = await request.execute("AddQuiz");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update(email, nameNeighbordhood, secure) {
    try {
      const quiz = new Quiz();

      quiz.propEmail = email;
      quiz.propSecure = secure;
      quiz.propNeighborhood = nameNeighbordhood;

      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), quiz.propEmail);
      request.input("neighbordhood", sql.VarChar(30), quiz.propNeighborhood);
      request.input("secure", sql.Bit, quiz.propSecure);

      const result = await request.execute("UpdateQuiz");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(email, nameNeighbordhood) {
    try {
      const quiz = new Quiz();

      quiz.propEmail = email;
      quiz.propNeighborhood = nameNeighbordhood;

      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), quiz.propEmail);
      request.input("neighbordhood", sql.VarChar(30), quiz.propNeighborhood);

      const result = await request.execute("DeleteQuiz");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getQuizesByNeighbordhoodAndYear(nameNeighbordhood, year) {
    try {
      const quiz = new Quiz();

      quiz.propNeighborhood = nameNeighbordhood;

      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("neighbordhood", sql.VarChar(30));
      ps.input("year", sql.Int);

      const result = await ps.prepare(
        "select * from Quizes where neighbordhood=@neighbordhood and YEAR(quizDate)=@year"
      );

      await ps.execute({
        neighbordhood: quiz.propNeighborhood,
        year: parseInt(year)
      });

      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
