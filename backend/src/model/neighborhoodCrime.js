export class NeighborhoodCrime {
  #crime;
  #neighborhood;
  #quantity;
  #year;

  set propCrime(value) {
    if (value.length == 0)
      throw new Error("Nombre de delito no puede estar vacio");
    this.#crime = value;
  }

  get propCrime() {
    return this.#crime;
  }

  set propNeighborhood(value) {
    if (value.length == 0) throw new Error("Barrio no puede estar vacio");
    this.#neighborhood = value;
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }
  set propYear(value) {
    if (value > new Date().getFullYear()) throw new Error("Año no puede ser mayor al año actual");
    this.#year = value;
  }
  get propYear() {
    return this.#year;
  }

  get propQuantity() {
    return this.#quantity;
  }
  set propQuantity(value) {
    if (value < 0) throw new Error("Cantidad no puede ser un numero negativo");
    this.#quantity = value;
  }
}
