import { QuizDAL } from "../dataAccess/quizDAL.js";
import { Neighborhood } from "./neighborhood.js";
const quizDAL = new QuizDAL();

export class Quiz {
  #email;
  #secure;
  #neighborhood;
  #quizDate;

  constructor(
    email = "correo@gmail.com",
    secure = 0,
    neighbordhood = new Neighborhood(),
    quizDate = new Date()
  ) {
    this.email = email;
    this.secure = secure;
    this.neighborhood = neighbordhood;
    this.quizDate = quizDate;
  }

  set email(value) {
    let regexEmail = /\S+@\S+\.\S+/;

    if (!regexEmail.test(value))
      throw new Error("Ingrese un correo valido", { cause: { code: 400 } });

    this.#email = value;
  }

  get email() {
    return this.#email;
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
    if (!value || new Date(value) > new Date())
      throw new Error("Fecha de encuesta no debe ser mayor a fecha actual", {
        cause: { code: 400 }
      });
    this.#quizDate = value;
  }

  get quizDate() {
    return this.#quizDate;
  }
}
