import { Rol } from "./rol.js";

export class User {
  #idUser;
  #name;
  #lastname;
  #email;
  #created;
  #lastModified;
  #rol;

  constructor(
    idUser,
    name = "desconocido",
    lastname = "desconocido",
    email = "email@gmail.com",
    created,
    lastModified,
    rol = new Rol()
  ) {
    this.idUser = idUser;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.created = created;
    this.lastModified = lastModified;
    this.rol = rol;
  }

  get idUser() {
    return this.#idUser;
  }

  get name() {
    return this.#name;
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

  set lastname(value) {
    if (!value || value.trim().length == 0)
      throw new Error("Nombre no puede estar vacio", { cause: { code: 400 } });
    else if (value.trim().length > 20)
      throw new Error("Nombre no debe tener mas de 20 caracteres", {
        cause: { code: 400 }
      });

    this.#lastname = value.trim();
  }

  get lastname() {
    return this.#lastname;
  }

  set email(value) {
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(value))
      throw new Error("Ingrese un correo con formato valido", {
        cause: { code: 400 }
      });

    this.#email = value.trim();
  }

  get email() {
    return this.#email;
  }

  set created(value) {
    this.#created = value;
  }

  get created() {
    return this.#created;
  }
  set lastModified(value) {
    this.#lastModified = value;
  }

  get lastModified() {
    return this.#lastModified;
  }

  set rol(value) {
    if (!value)
      throw new Error("Debe indicar un rol", {
        cause: { code: 400 }
      });

    this.#rol = value.trim();
  }

  get rol() {
    return this.#rol;
  }
}
