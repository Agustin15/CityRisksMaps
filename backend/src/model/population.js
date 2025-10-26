export class Population {
  #idPopulation;
  #quantity;
  #neighborhood;
  #year;

  set propIdPopulation(value) {
    if (typeof value != "number")
      throw new Error("Id poblacion debe ser un numero");
    this.#idPopulation = value;
  }

  get propIdPopulation() {
    return this.#idPopulation;
  }

  set propNeighborhood(value) {
    if (value.length == 0) throw new Error("Barrio no puede estar vacio");
    this.#neighborhood = value;
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }

  get propQuantity() {
    return this.#quantity;
  }
  set propQuantity(value) {
    if (value < 0) throw new Error("Cantidad no puede ser un numero negativo");
    this.#quantity = value;
  }

  set propYear(value) {
    if (value > new Date().getFullYear())
      throw new Error("Año no puede ser mayor al año actual");
    this.#year = value;
  }
  get propYear() {
    return this.#year;
  }
}
