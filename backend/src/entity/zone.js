export class Zone {
  #idZone;
  #description;
  #coordinates;
  #enable;
  #created;
  #lastModified;
  #neighborhoods;

  constructor(
    idZone,
    description = "desconocida",
    coordinates = [],
    expiration,
    created,
    neighborhoods = []
  ) {
    this.idZone = idZone;
    this.description = description;
    this.coordinates = coordinates;
    this.expiration = expiration;
    this.created = created;
    this.neighborhoods = neighborhoods;
  }

  get idZone() {
    return this.#idZone;
  }

  get idZone() {
    return this.#idZone;
  }

  set description(value) {
    if (!value || value.trim().length == 0)
      throw new Error("La descripcion no puede estar vacia", {
        cause: { code: 400 }
      });
    else if (value.trim().length > 250)
      throw new Error("La descripcion no debe tener mas de 250 caracteres", {
        cause: { code: 400 }
      });

    this.#description = value.trim();
  }

  get description() {
    return this.#description;
  }

  set coordinates(value) {
    if (!value)
      throw new Error("Debe indicar las coordenadas de la zona", {
        cause: { code: 400 }
      });

    this.#coordinates = value.trim();
  }

  get coordinates() {
    return this.#coordinates;
  }

  set enable(value) {
    if (value != 0 && value != 1)
      throw new Error("Habilitar solo acepta valores de verdadero o falso", {
        cause: { code: 400 }
      });
    this.#enable = value;
  }

  get enable() {
    return this.#enable;
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

  set neighborhoods(value) {
    if (typeof value != "object")
      throw new Error("Debe indicar los barrios a los que pertencen la zona", {
        cause: { code: 400 }
      });

    this.#neighborhoods = value.trim();
  }

  get neighborhoods() {
    return this.#neighborhoods;
  }
}
