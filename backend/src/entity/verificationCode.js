import { User } from "./user.js";
import { randomInt } from "node:crypto";

export class VerificationCode {
  #code;
  #expiration;
  #user;

  constructor(code, expiration = new Date(), user = new User()) {
    this.code = code;
    this.expiration = expiration;
    this.user = user;
  }

  set code(value) {
    this.#code = value.trim();
  }

  get code() {
    return this.#code;
  }

  set expiration(value) {
    if (!value || new Date(value) == "Invalid Date")
      throw new Error("Fecha de expiration no valida", {
        cause: { code: 400 }
      });
    this.#expiration = value;
  }

  get expiration() {
    return this.#expiration;
  }

  set user(value) {
    if (!user)
      throw new Error("Debe indicar un usuario", { cause: { code: 400 } });
    this.#user = value;
  }

  get user() {
    return this.#user;
  }

  generateCode() {
    let code = "";

    let characters =
      "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789";

    for (let f = 0; f < 6; f++) {
      let charSelected = characters.charAt(randomInt(0, 65));
      code += charSelected;
    }

    return code;
  }

  generateExpiration() {
    return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  }
}
