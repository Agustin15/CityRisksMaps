export class Quiz {
  #email;
  #secure;
  #date;
  #neighborhood;

  set propEmail(value) {
    if (value.length == 0) throw new Error("Ingresa un correo valido");
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

  set propDate(value) {
    if (date > new Date())
      throw new Error(
        "Fecha de la encuesta no puede ser mayor a la fecha actual"
      );
    this.#date = value;
  }

  get propDate() {
    return this.#date;
  }
  set propNeighborhood(value) {
    if (value.length == 0)
      throw new Error("Nombre del barrio no puede estar vacio");
    this.#neighborhood = value;
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }
}
