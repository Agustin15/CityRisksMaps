export class Crime {
  #category;
  #description;

  set propCategory(value) {
    if (value.length == 0) throw new Error("Category must not be empty");
    this.#category = value;
  }

  get propCategory() {
    return this.#category;
  }

  set propDescription(value) {
    if (value.length == 0) throw new Error("Description must not be empty");
    this.#description = value;
  }

  get propDescription() {
    return this.#description;
  }
}
