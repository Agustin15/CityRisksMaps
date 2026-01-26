export class Department {
  #idDepartment;
  #name;
  #neighborhoods;

  constructor(idDepartment = 0, name = "desconocido", neighborhoods = []) {
    this.idDepartment = idDepartment;
    this.name = name;
    this.neighborhoods = neighborhoods;
  }

  set idDepartment(value) {
    if (typeof value != "number")
      throw new Error("Id departamento debe ser un numero", {
        cause: { code: 400 }
      });
    this.#idDepartment = value;
  }

  get idDepartment() {
    return this.#idDepartment;
  }

  set name(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio", { cause: { code: 400 } });
    this.#name = value.trim();
  }

  get name() {
    return this.#name;
  }

  set neighborhoods(value) {
    if (typeof value != "object")
      throw new Error("Barrios debe ser una lista", { cause: { code: 400 } });
    this.#neighborhoods = value;
  }

  get neighborhoods() {
    return this.#neighborhoods;
  }
}
