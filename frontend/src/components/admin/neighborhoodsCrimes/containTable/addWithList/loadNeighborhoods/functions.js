import { alertSwalErrorAdmin } from "../../../../../sweetAlert/sweetAlert.js";

export const handleChangeInput = (event, idNeighborhood, values, setValues) => {
  const newNeighborhoodsCrime = values.neighborhoodsCrime.map((nhCrime) => {
    if (nhCrime.idNeighborhood == idNeighborhood)
      nhCrime.amount =
        event.target.value.length > 0 ? parseInt(event.target.value) : null;

    return nhCrime;
  });

  setValues({
    ...values,
    neighborhoodsCrime: newNeighborhoodsCrime
  });
};

export const handleChangeCheckbox = (
  event,
  idNeighborhood,
  values,
  setValues
) => {
  setValues({
    ...values,
    neighborhoodsCrime: values.neighborhoodsCrime.map((hoodCrime) =>
      hoodCrime.idNeighborhood == idNeighborhood
        ? { ...hoodCrime, amount: event.target.checked ? 0 : null }
        : hoodCrime
    )
  });
};

export const setValueAmount = (values, idNeighborhood) => {
  const found = values.neighborhoodsCrime.find(
    (hoodCrime) => hoodCrime.idNeighborhood == idNeighborhood
  );

  return found.amount == null ? "" : found.amount;
};

export const verifyChecked = (values, idNeighborhood) => {
  const found = values.neighborhoodsCrime.find(
    (hood) => hood.idNeighborhood == idNeighborhood
  );

  return found.amount != null;
};
