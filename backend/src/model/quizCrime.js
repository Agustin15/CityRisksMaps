import { Quiz } from "./quiz";

export class QuizCrime {
  #quiz;
  #crimes;

  constructor(quiz = new Quiz(), crime = []) {
    this.quiz = quiz;
    this.crimes = crime;
  }

  set quiz(value) {
    if (value == null) throw new Error("Debe indicar una encuesta");
    this.#quiz = value;
  }

  get quiz() {
    return this.#quiz;
  }

  set crimes(value) {
    if (value == null) throw new Error("Debe indicar una crimen");
    this.#crimes = value;
  }

  get crimes() {
    return this.#crimes;
  }
}
