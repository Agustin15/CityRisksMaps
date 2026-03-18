export class Department {
  #idDepartment;
  #name;

  constructor(idDepartment = 0, name = "desconocido") {
    this.idDepartment = idDepartment;
    this.name = name;
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
    else if (value.trim().length > 30)
      throw new Error("Nombre no debe tener mas de 30 caracteres", {
        cause: { code: 400 }
      });

    this.#name = value.trim();
  }

  get name() {
    return this.#name;
  }
}
