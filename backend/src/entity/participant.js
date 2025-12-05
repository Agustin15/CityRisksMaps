export class Participant {
  #email;
  #created;
  #lastIncome;

  constructor(
    email = "user@gmail.com",
    created = new Date(),
    lastIncome = new Date()
  ) {
    this.email = email;
    this.created = created;
    this.lastIncome = lastIncome;
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
}
