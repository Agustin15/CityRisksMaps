import { Neighborhood } from "./neighborhood.js";
import { Participant } from "./participant.js";

export class Quiz {
  #idQuiz;
  #secure;
  #quizDate;
  #participant;
  #neighborhood;
  #crimes;

  constructor(
    idQuiz = 0,
    participant = new Participant(),
    secure = 0,
    neighbordhood = new Neighborhood(),
    crimes = [],
    quizDate = new Date()
  ) {
    this.idQuiz = idQuiz;
    this.Participant = participant;
    this.secure = secure;
    this.neighborhood = neighbordhood;
    this.quizDate = quizDate;
    this.crimes = crimes;
  }

  set idQuiz(value) {
    if (typeof value != "number")
      throw new Error("ID de encuesta debe ser un numero", {
        cause: { code: 400 }
      });

    this.#idQuiz = value;
  }

  get idQuiz() {
    return this.#idQuiz;
  }

  set secure(value) {
    if (value != 0 && value != 1)
      throw new Error("Debe completar sensacion de seguridad", {
        cause: { code: 400 }
      });
    this.#secure = value;
  }

  get secure() {
    return this.#secure;
  }

  set participant(value) {
    if (value == null)
      throw new Error("Debe indicar un participante", {
        cause: { code: 400 }
      });
    this.#participant = value;
  }

  get participant() {
    return this.#participant;
  }

  set neighborhood(value) {
    if (value == null)
      throw new Error("Debe indicar un barrio", {
        cause: { code: 400 }
      });
    this.#neighborhood = value;
  }

  get neighborhood() {
    return this.#neighborhood;
  }

  set quizDate(value) {
    if (!value || new Date(value) == "Invalid Date")
      throw new Error("Fecha de encuesta no valida");
    this.#quizDate = value;
  }

  get quizDate() {
    return this.#quizDate;
  }

  set crimes(value) {
    if (typeof value != "object")
      throw new Error("Crimenes debe ser una lista", {
        cause: { code: 400 }
      });
    this.#crimes = value;
  }

  get crimes() {
    return this.#crimes;
  }
}
