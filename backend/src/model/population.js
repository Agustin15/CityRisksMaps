import { Neighborhood } from "./neighborhood.js";

export class Population {
  #idPopulation;
  #quantity;
  #neighborhood;
  #year;

  constructor(
    idPopulation = 0,
    quantity = 0,
    neighborhood = new Neighborhood(),
    year = new Date.getFullYear()
  ) {
    this.idPopulation = idPopulation;
    this.quantity = quantity;
    this.neighborhood = neighborhood;
    this.year = year;
  }

  set idPopulation(value) {
    if (typeof value != "number")
      throw new Error("Id poblacion debe ser un numero", {
        cause: { code: 400 }
      });
    this.#idPopulation = value;
  }

  get idPopulation() {
    return this.#idPopulation;
  }

  set neighborhood(value) {
    if (value == null)
      throw new Error("Debe indicar un barrio", { cause: { code: 400 } });
    this.#neighborhood = value;
  }

  get neighborhood() {
    return this.#neighborhood;
  }

  get quantity() {
    return this.#quantity;
  }
  set quantity(value) {
    if (!value || value < 0)
      throw new Error("Cantidad no puede ser un numero negativo", {
        cause: { code: 400 }
      });
    this.#quantity = value;
  }

  set year(value) {
    if (!value || value > new Date().getFullYear())
      throw new Error("Año no puede ser mayor al año actual", {
        cause: { code: 400 }
      });
    this.#year = value;
  }
  get year() {
    return this.#year;
  }

}
