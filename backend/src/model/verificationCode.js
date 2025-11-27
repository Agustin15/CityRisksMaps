import { Participant } from "./participant.js";
import { randomInt } from "node:crypto";

export class VerificationCode {
  #code;
  #expiration;
  #participant;

  constructor(
    code = "000FFF",
    expiration = new Date(),
    participant = new Participant()
  ) {
    this.code = code;
    this.expiration = expiration;
    this.participant = participant;
  }

  set code(value) {
    if (!value)
      throw new Error("Codigo de verificacion no indicado", {
        cause: { code: 400 }
      });
    this.#code = value;
  }

  get code() {
    return this.#code;
  }

  set expiration(value) {
    if (!value || new Date(value) == "Invalid Date")
      throw new Error("Fecha de expiration no valida");
    this.#expiration = value;
  }

  get expiration() {
    return this.#expiration;
  }

  set participant(value) {
    if (!value) throw new Error("Debe indicar un participante");
    this.#participant = value;
  }

  get participant() {
    return this.#participant;
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
