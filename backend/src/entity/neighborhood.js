import { Department } from "./department.js";

export class Neighborhood {
  #idNeighborhood;
  #name;
  #department;

  constructor(
    idNeighborhood = 0,
    name = "desconocido",
    department = new Department()
  ) {
    this.idNeighborhood = idNeighborhood;
    this.name = name;
    this.department = department;
  }

  set idNeighborhood(value) {
    if (typeof value != "number")
      throw new Error("Id barrio debe ser un numero", {
        cause: { code: 400 }
      });
    this.#idNeighborhood = value;
  }

  get idNeighborhood() {
    return this.#idNeighborhood;
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
}
