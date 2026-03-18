export class Rol {
  #idRol;
  #name;

  constructor(idRol, name = "desconocido") {
    this.idRol = idRol;
    this.name = name;
  }

  set idRol(value) {
    this.#idRol = value;
  }

  get idRol() {
    return this.#idRol;
  }

  set name(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio", { cause: { code: 400 } });
    else if (value.trim().length > 20)
      throw new Error("Nombre no debe tener mas de 20 caracteres", {
        cause: { code: 400 }
      });

    this.#name = value.trim();
  }

  get name() {
    return this.#name;
  }
}
