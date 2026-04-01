export const validationForm = (values) => {
  const errorsValues = { name: "", idDepartment: "" };

  if (values.name.length == 0) {
    errorsValues["name"] = "*Debe ingresar un nombre";
  }

  if (values.idDepartment == 0) {
    errorsValues["idDepartment"] = "*Debe seleccionar un departamento";
  }

  return errorsValues;
};
