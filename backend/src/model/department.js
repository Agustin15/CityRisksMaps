export class Department {
  #idDepartment;
  #name;

  set propName(value) {
    if (value.length == 0) throw new Error("Nombre no puede estar vacio");
    this.#name = value;
  }

  get propName() {
    return this.#name;
  }
  set propIdDepartment(value) {
    if (typeof value != "number") throw new Error("Id departamento debe ser un numero");
    this.#idDepartment = value;
  }

  get propIdDepartment() {
    return this.#idDepartment;
  }
}
