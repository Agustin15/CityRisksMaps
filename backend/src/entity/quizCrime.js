import { Quiz } from "./quiz.js";
import { Crime } from "./crime.js";

export class QuizCrime {
  #quiz;
  #crime;

  constructor(quiz = new Quiz(), crime = new Crime()) {
    this.quiz = quiz;
    this.crime = crime;
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
    this.#crime = value;
  }

  get crimes() {
    return this.#crime;
  }
}
