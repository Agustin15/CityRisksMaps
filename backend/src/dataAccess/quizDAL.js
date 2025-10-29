import { connection } from "../config/connection.js";
import sql from "mssql";

export class QuizDAL {
  async add(email, nameNeighbordhood, secure) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), email);
      request.input("neighbordhood", sql.VarChar(30), nameNeighbordhood);
      request.input("secure", sql.Bit, secure);

      const result = await request.execute("AddQuiz");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const request = new sql.Request(connection.pool);

      const identCurrent = await request.execute(
        "SELECT IDENT_CURRENT('Quizes')"
      );

      return identCurrent;
    } catch (error) {
      throw error;
    }
  }
  async update(email, nameNeighbordhood, secure) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), email);
      request.input("neighbordhood", sql.VarChar(30), nameNeighbordhood);
      request.input("secure", sql.Bit, secure);

      const result = await request.execute("UpdateQuiz");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(email, nameNeighbordhood) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar(30), email);
      request.input("neighbordhood", sql.VarChar(30), nameNeighbordhood);

      const result = await request.execute("DeleteQuiz");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getQuizesByNeighbordhoodAndYear(nameNeighbordhood, year) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("neighbordhood", sql.VarChar(30));
      ps.input("year", sql.Int);

      const result = await ps.prepare(
        "select * from Quizes where neighbordhood=@neighbordhood and YEAR(quizDate)=@year"
      );

      await ps.execute({
        neighbordhood: nameNeighbordhood,
        year: parseInt(year)
      });

      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
