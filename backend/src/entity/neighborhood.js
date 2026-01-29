import { Department } from "./department.js";

export class Neighborhood {
  #name;
  #department;
  #anualPopulations;
  #quizes;

  constructor(
    name = "desconocido",
    department = new Department(),
    anualPopulations = [],
    quizes = []
  ) {
    this.name = name;
    this.department = department;
    this.anualPopulations = anualPopulations;
    this.quizes = quizes;
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

  set anualPopulations(value) {
    if (typeof value != "object")
      throw new Error("Poblaciones debe ser una lista", {
        cause: { code: 400 }
      });
    this.#anualPopulations = value;
  }

  get anualPopulations() {
    return this.#anualPopulations;
  }

  set quizes(value) {
    if (typeof value != "object")
      throw new Error("Encuestas debe ser una lista", {
        cause: { code: 400 }
      });
    this.#quizes = value;
  }

  get quizes() {
    return this.#quizes;
  }
}
