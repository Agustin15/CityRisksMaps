export class Department {
  #name;
  #population;

  set propName(value) {
    if (value.length == 0) throw new Error("Name must no be empty");
    this.#name = value;
  }

  get propName() {
    return this.#name;
  }

  set propPopulation(value) {
    if (value <= 0) throw new Error("Population must be greater than zero");
    this.#population = value;
  }

  get propPopulation() {
    return this.#population;
  }
}
