import { QuizDAL } from "../dataAccessLayer/quizDAL.js";

export class QuizService {
  static async add(quiz, transaction) {
    try {
      if (quiz == null)
        throw new Error("Debe indicar una encuesta para agregar");

      const idQuizAdded = await QuizDAL.add(quiz, transaction);

      return idQuizAdded;
    } catch (error) {
      throw error;
    }
  }

  static async update(quiz) {
    try {
      if (quiz == null)
        throw new Error("Debe indicar una encuesta para editar");

      const updated = await QuizDAL.update(quiz);

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(idQuiz) {
    try {
      const deleted = await QuizDAL.delete(idQuiz);

      return deleted;
    } catch (error) {
      throw error;
    }
  }

  static async getQuizesYears() {
    try {
      const result = await QuizDAL.getQuizesYears();

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getQuizesByNeighbordhoodAndYear(year) {
    try {
      const result = await QuizDAL.getQuizesNeighbordhoodByYear(year);

      if (result.length > 0) {
        result.forEach((result) => {
          if (result.secure == null) result.secure = 0;
          if (result.insecure == null) result.insecure = 0;

          result.total = result.secure + result.insecure;

          result.percentage =
            result.total == 0 ? 0 : (result.secure * 100) / result.total;
        });
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getSecurityPercentagesInNeighborhood(neighborhood) {
    try {
      const result = await QuizDAL.getSecurityPercentagesInNeighborhood(
        neighborhood
      );

      if (result.length > 0) {
        result.forEach((quizData) => {
          quizData.quantitySecure = quizData.quantitySecure
            ? quizData.quantitySecure
            : 0;

          quizData.securityPercentage =
            (quizData.quantitySecure * 100) / quizData.quantityQuizes;
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getYearsOfParticipantQuizes(participant) {
    try {
      const result = await QuizDAL.getYearsOfParticipantQuizes(participant);

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getQuizesByParticipantAndYear(participant, year) {
    try {
      const result = await QuizDAL.getQuizesByParticipantAndYear(
        participant,
        year
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getLimitQuizesByParticipantAndYear(participant, year, offset) {
    try {
      const result = await QuizDAL.getLimitQuizesByParticipantAndYear(
        participant,
        year,
        offset
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
