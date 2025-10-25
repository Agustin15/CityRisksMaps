export class Neighborhood {
  #name;
  #department;

  set propName(value) {
    if (value.length == 0) throw new Error("Nombre no puede estar vacio");
    this.#name = value;
  }

  get propName() {
    return this.#name;
  }

  set propDepartment(value) {
    if (typeof value!="number") throw new Error("Id de departamento debe ser un numero");
    this.#department = value;
  }

  get propDepartment() {
    return this.#department;
  }
}
