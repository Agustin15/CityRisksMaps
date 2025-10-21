export class NeighborhoodCrime {
  #crime;
  #neighborhood;
  #quantity;
  #year;

  set propCrime(value) {
    if (value.length == 0) throw new Error("Crime must not be empty");
    this.#crime = value;
  }

  get propCrime() {
    return this.#crime;
  }

  set propNeighborhood(value) {
    if (value.length == 0) throw new Error("Neighborhood must not be empty");
    this.#neighborhood = value;
  }

  get propNeighborhood() {
    return this.#neighborhood;
  }
  set propYear(value) {
    if (value < 2023) throw new Error("Year must be greater than year 2022");
    this.#year = value;
  }
  get propYear() {
    return this.#year;
  }

  get propQuantity() {
    return this.#quantity;
  }
  set propQuantity(value) {
    if (value < 0) throw new Error("Quantity must not be less than zero");
    this.#quantity = value;
  }
}
