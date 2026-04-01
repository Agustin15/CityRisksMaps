export const validationForm = (values) => {
  const errorValues = {
    name: "",
    lastname: "",
    email: "",
    idRol: ""
  };

  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  switch (true) {
    case values.name.length == 0:
      errorValues["name"] = "Debe indicar un nombre";
    case values.lastname.length == 0:
      errorValues["lastname"] = "Debe indicar un apellido";
    case !regexEmail.test(values.email):
      errorValues["email"] = "Ingrese un formato de correo valido";
    case values.idRol == 0:
      errorValues["idRol"] = "Debe seleccionar un rol";
  }

  return errorValues;
};
