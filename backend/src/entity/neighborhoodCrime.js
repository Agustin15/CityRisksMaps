import { Crime } from "./crime.js";
import { Neighborhood } from "./neighborhood.js";

export class NeighborhoodCrime {
  #crime;
  #neighborhood;
  #quantity;
  #year;

  constructor(
    crime = new Crime(),
    neighbordhood = new Neighborhood(),
    quantity = 0,
    year = new Date().getFullYear()
  ) {
    this.crime = crime;
    this.neighborhood = neighbordhood;
    this.propQuantity = quantity;
    this.propYear = year;
  }

  set crime(value) {
    if (value == 0)
      throw new Error("Debe indicar un crimen", {
        cause: { code: 400 }
      });
    this.#crime = value;
  }

  get crime() {
    return this.#crime;
  }

  set neighborhood(value) {
    if (value == null)
      throw new Error("Debe indicar un barrio", { cause: { code: 400 } });
    this.#neighborhood = value;
  }

  get neighborhood() {
    return this.#neighborhood;
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

  get quantity() {
    return this.#quantity;
  }
  set quantity(value) {
    if (value < 0) throw new Error("Cantidad no puede ser un numero negativo");
    this.#quantity = value;
  }
}
