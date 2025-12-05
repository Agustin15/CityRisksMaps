import { Department } from "./department.js";

export class Neighborhood {
  #name;
  #department;

  constructor(name = "desconocido", department = new Department()) {
    this.name = name;
    this.department = department;
  }

  set name(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio", { cause: { code: 400 } });
    this.#name = value.trim();
  }

  get name() {
    return this.#name;
  }

  set department(value) {
    if (value == null)
      throw new Error("Debe indicar un departamento", {
        cause: { code: 400 }
      });
    this.#department = value;
  }

  get department() {
    return this.#department;
  }
}
