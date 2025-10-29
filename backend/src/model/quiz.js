import { QuizDAL } from "../dataAccess/quizDAL.js";
const quizDAL = new QuizDAL();

export class Quiz {
  #email;
  #secure;
  #neighborhood;

  constructor(
    email = "correo@gmail.com",
    secure = 0,
    neighbordhood = "desconocido"
  ) {
    this.propEmail = email;
    this.propSecure = secure;
    this.propNeighborhood = neighbordhood;
  }

  set propEmail(value) {
    let regexEmail = /\S+@\S+\.\S+/;

    if (!regexEmail.test(value)) throw new Error("Ingrese un correo valido");

    this.#email = value;
  }

  get propEmail() {
    return this.#email;
  }

  set propSecure(value) {
    if (value != 0 && value != 1)
      throw new Error("Debe completar sensacion de seguridad");
    this.#secure = value;
  }

  get propSecure() {
    return this.#secure;
  }

  set propNeighborhood(value) {
    if (value.trim().length == 0)
      throw new Error("Nombre del barrio no puede estar vacio");
    this.#neighborhood = value.trim();
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }

  async add() {
    try {
      const returnValue = await quizDAL.add(
        this.propEmail,
        this.propNeighborhood,
        this.propSecure
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getIdentCurrentTable() {
    try {
      const identCurrent = await quizDAL.getIdentCurrentTable();
      return identCurrent;
    } catch (error) {
      throw error;
    }
  }
  async update() {
    try {
      const returnValue = await quizDAL.update(
        this.propEmail,
        this.propNeighborhood,
        this.propSecure
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const returnValue = await quizDAL.delete(
        this.propEmail,
        this.propNeighborhood
      );

      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getQuizesByNeighbordhoodAndYear(year) {
    try {
      const result = await quizDAL.getQuizesByNeighbordhoodAndYear(
        this.propNeighborhood,
        year
      );

      if (result.recordset.length > 0) {
        return result.recordset.map((quiz) => {
          return new Quiz(quiz.email, quiz.secure, quiz.neighbordhood);
        });
      }

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
