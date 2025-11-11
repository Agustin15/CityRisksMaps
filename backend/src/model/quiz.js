import { QuizDAL } from "../dataAccess/quizDAL.js";
const quizDAL = new QuizDAL();

export class Quiz {
  #email;
  #secure;
  #neighborhood;
  #quizDate;

  constructor(
    email = "correo@gmail.com",
    secure = 0,
    neighbordhood = "desconocido",
    quizDate = new Date()
  ) {
    this.propEmail = email;
    this.propSecure = secure;
    this.propNeighborhood = neighbordhood;
    this.propQuizDate = quizDate;
  }

  set propEmail(value) {
    let regexEmail = /\S+@\S+\.\S+/;

    if (!regexEmail.test(value))
      throw new Error("Ingrese un correo valido", { cause: { code: 400 } });

    this.#email = value;
  }

  get propEmail() {
    return this.#email;
  }

  set propSecure(value) {
    if (value != 0 && value != 1)
      throw new Error("Debe completar sensacion de seguridad", {
        cause: { code: 400 }
      });
    this.#secure = value;
  }

  get propSecure() {
    return this.#secure;
  }

  set propNeighborhood(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Nombre del barrio no puede estar vacio", {
        cause: { code: 400 }
      });
    this.#neighborhood = value.trim();
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }

  set propQuizDate(value) {
    if (!value || new Date(value) > new Date())
      throw new Error("Fecha de encuesta no debe ser mayor a fecha actual", {
        cause: { code: 400 }
      });
    this.#quizDate = value;
  }

  get propQuizDate() {
    return this.#quizDate;
  }

  async add() {
    try {
      const returnValue = await quizDAL.add(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      const returnValue = await quizDAL.update(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await quizDAL.delete(this);

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getQuizesByNeighbordhoodAndYear(year) {
    try {
      const result = await quizDAL.getQuizesByNeighbordhoodAndYear(this, year);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
