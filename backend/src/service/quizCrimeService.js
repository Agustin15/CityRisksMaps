import { QuizCrimeDAL } from "../dataAccess/quizCrimeDAL.js";
import { QuizCrime } from "../model/quizCrime.js";

export class QuizCrimeService {
  static async add(quiz, crimes, transaction) {
    try {
      if (quiz == null) throw new Error("Debe indicar una encuesta");

      for (const crime of crimes) {
        const quizCrime = new QuizCrime(quiz, crime);

        await QuizCrimeDAL.add(quizCrime, transaction);
      }
    } catch (error) {
      throw error;
    }
  }
}
