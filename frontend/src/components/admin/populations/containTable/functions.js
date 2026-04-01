export const validationForm = (values) => {
  const errorsValues = {
    nameNeighborhood: "",
    quantity: "",
    year: ""
  };

  if (values.nameNeighborhood == "Seleccionar")
    errorsValues["nameNeighborhood"] = "*Debe seleccionar un barrio";

  if (values.quantity.length == 0)
    errorsValues["quantity"] = "*Debe ingresar cantidad de habitantes";

  if (values.year.length == 0) errorsValues["year"] = "*Debe ingresar el año";

  return errorsValues;
};
