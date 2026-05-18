import { User } from "./user.js";
import { randomInt } from "node:crypto";

export class VerificationCode {
  #code;
  #expiration;
  #user;

  constructor(user) {
    this.code = randomInt(100000, 999999);
    this.expiration = new Date(new Date().getTime() + 900 * 1000);
    this.user = user;
  }

  set code(value) {
    this.#code = value;
  }

  get code() {
    return this.#code;
  }

  set expiration(value) {
    this.#expiration = value;
  }

  get expiration() {
    return this.#expiration;
  }

  set user(value) {
    this.#user = value;
  }

  get user() {
    return this.#user;
  }
}
