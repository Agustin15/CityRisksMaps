export class Crime {
  #category;
  #description;

  set propCategory(value) {
    if (value.length == 0) throw new Error("Categoria no puede estar vacia");
    this.#category = value;
  }

  get propCategory() {
    return this.#category;
  }

  set propDescription(value) {
    if (value.length == 0) throw new Error("Descripcion no puede estar vacia");
    this.#description = value;
  }

  get propDescription() {
    return this.#description;
  }
}
