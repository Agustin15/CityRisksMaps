export const defineEndpointToRefreshDataAfterChanges = (index, params) => {
  let controller = !params.controller
    ? "getNeighborhoodsOffset"
    : params.controller;

  return (
    "/neighborhood/" +
    JSON.stringify({
      option: controller,
      offset: index * 10,
      ...(params.id && {
        id: params.id
      })
    })
  );
};

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
