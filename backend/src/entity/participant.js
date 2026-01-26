export class Participant {
  #email;
  #created;
  #lastIncome;
  #quizes;
  #verificationCodes;

  constructor(
    email = "user@gmail.com",
    created = new Date(),
    lastIncome = new Date(),
    quizes = [],
    verificationCodes = []
  ) {
    this.email = email;
    this.created = created;
    this.lastIncome = lastIncome;
    this.quizes = quizes;
    this.verificationCodes = verificationCodes;
  }

  set email(value) {
    let regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(value))
      throw new Error("Formato de correo invalido", {
        cause: { code: 400 }
      });
    this.#email = value;
  }

  get email() {
    return this.#email;
  }

  set created(value) {
    if (!value || new Date(value) == "Invalid Date")
      throw new Error("Fecha de creacion no valida", {
        cause: { code: 400 }
      });
    this.#created = value;
  }

  get created() {
    return this.#created;
  }

  set lastIncome(value) {
    if (!value || new Date(value) == "Invalid Date")
      throw new Error("Fecha de ultima vez de ingreso no valida", {
        cause: { code: 400 }
      });
    this.#lastIncome = value;
  }

  get lastIncome() {
    return this.#lastIncome;
  }

  set quizes(value) {
    if (typeof value != "object")
      throw new Error("Encuestas debe ser una lista", {
        cause: { code: 400 }
      });
    this.#quizes = value;
  }

  get quizes() {
    return this.#quizes;
  }

  set verificationCodes(value) {
    if (typeof value != "object")
      throw new Error("Codigos de verificacion debe ser una lista", {
        cause: { code: 400 }
      });
    this.#verificationCodes = value;
  }

  get verificationCodes() {
    return this.#verificationCodes;
  }
}
