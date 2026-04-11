import { Crime } from "./crime.js";
import { Neighborhood } from "./neighborhood.js";

export class NeighborhoodCrime {
  #crime;
  #neighborhood;
  #quantity;
  #month;
  #dayMostActivity;
  #year;
  #rate;
  #increase;

  constructor(
    crime = new Crime(),
    neighbordhood = new Neighborhood(),
    quantity = 0,
    month = 1,
    dayMostActivity = 1,
    year = new Date().getFullYear(),
    increase,
    rate
  ) {
    this.crime = crime;
    this.neighborhood = neighbordhood;
    this.quantity = quantity;
    this.month = month;
    this.dayMostActivity = dayMostActivity;
    this.year = year;
    this.increase = increase;
    this.rate = rate;
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

  get quantity() {
    return this.#quantity;
  }
  set quantity(value) {
    if (value < 0) throw new Error("Cantidad no puede ser un numero negativo");
    this.#quantity = value;
  }
  set month(value) {
    if (value <= 0)
      throw new Error("Numero de mes debe ser mayor a cero", {
        cause: { code: 400 }
      });
    this.#month = value;
  }
  get month() {
    return this.#month;
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

  set dayMostActivity(value) {
    if (value <= 0)
      throw new Error("Dia de la semana debe ser mayor a cero", {
        cause: { code: 400 }
      });
    this.#dayMostActivity = value;
  }
  get dayMostActivity() {
    return this.#dayMostActivity;
  }
  get increase() {
    return this.#increase;
  }
  set increase(value) {
    this.#increase = value;
  }

  get rate() {
    return this.#rate;
  }
  set rate(value) {
    this.#rate = value;
  }
}
