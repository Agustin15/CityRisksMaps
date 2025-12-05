export class Department {
  #idDepartment;
  #name;

  constructor(idDepartment = 0, name = "desconocido") {
    this.idDepartment = idDepartment;
    this.name = name;
  }

  set name(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio", { cause: { code: 400 } });
    this.#name = value.trim();
  }

  get name() {
    return this.#name;
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
}
