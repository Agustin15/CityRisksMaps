export class Crime {
  #category;
  #description;

  constructor(category = "desconocido", description = "desconocido") {
    this.category = category;
    this.description = description;
  }

  set category(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Categoria no puede estar vacia", {
        cause: { code: 400 }
      });
    else if (value.trim().length > 20)
      throw new Error("Categoria no debe tener mas de 20 caracteres", {
        cause: { code: 400 }
      });

    this.#category = value.trim();
  }

  get category() {
    return this.#category;
  }

  set description(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Descripcion no puede estar vacia", {
        cause: { code: 400 }
      });
    else if (value.trim().length > 700)
      throw new Error("Descripcion no debe tener mas de 700 caracteres", {
        cause: { code: 400 }
      });
    this.#description = value.trim();
  }

  get description() {
    return this.#description;
  }
}
