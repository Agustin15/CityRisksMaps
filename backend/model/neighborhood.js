export class Neighborhood {
  #name;
  #population;
  #department;

  set propName(value) {
    if (value.length == 0) throw new Error("Name must not be empty");
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

  set propDepartment(value) {
    if (value.length == 0) throw new Error("Department name must not be empty");
    this.#department = value;
  }

  get propDepartment() {
    return this.#department;
  }
}
