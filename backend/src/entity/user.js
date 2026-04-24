import { Rol } from "./rol.js";

export class User {
  #idUser;
  #name;
  #lastname;
  #email;
  #password;
  #rol;
  #avatar;

  constructor(
    idUser = 0,
    name = "desconocido",
    lastname = "desconocido",
    email = "email@gmail.com",
    password = "D98932B1kfo#m.l",
    avatar = null,
    rol = new Rol()
  ) {
    this.idUser = idUser;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.avatar = avatar;
  }

  set idUser(value) {
    if (typeof value != "number")
      throw new Error("Id usuario debe ser un numero", {
        cause: { code: 400 }
      });

    this.#idUser = value;
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

    this.#email = value;
  }

  get email() {
    return this.#email;
  }
  set password(value) {
    if (value.length == 0) throw new Error("Debe indicar un contraseña");
    this.#password = value;
  }

  get password() {
    return this.#password;
  }

  set rol(value) {
    if (!value)
      throw new Error("Debe indicar un rol", {
        cause: { code: 400 }
      });

    this.#rol = value;
  }

  get rol() {
    return this.#rol;
  }

  set avatar(value) {
    if (value != null && value.length == 0)
      throw new Error(
        "La direccion de la imagen del avatar no puede estar vacia",
        {
          cause: { code: 400 }
        }
      );

    this.#avatar = value;
  }

  get avatar() {
    return this.#avatar;
  }
}
