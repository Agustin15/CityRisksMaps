import { alertSwalErrorAdmin } from "../../../../../sweetAlert/sweetAlert.js";

export const handleChangeInput = (
  event,
  neighborhoodName,
  values,
  setValues
) => {
  const newNeighborhoodsCrime = values.neighborhoodsCrime.map((nhCrime) => {
    if (nhCrime.nameNeighborhood == neighborhoodName) {
      if (event.target.value != null && event.target.value.length == 0) {
        nhCrime.amount = "";
      } else nhCrime.amount = event.target.value;
    }

    return nhCrime;
  });

  setValues({
    ...values,
    ["neighborhoodsCrime"]: newNeighborhoodsCrime
  });
};

export const handleChangeCheckbox = (
  neighborhoodName,
  neighborhoodsSelected,
  setNeighborhoodsSelected
) => {
  setNeighborhoodsSelected(
    neighborhoodsSelected.map((hoodSelected) =>
      hoodSelected.neighborhood == neighborhoodName
        ? { ...hoodSelected, checked: hoodSelected.checked ? false : true }
        : hoodSelected
    )
  );
};

export const setValueAmount = (neighborhoodsCrime, nameNeighborhood) => {
  const found = neighborhoodsCrime.find(
    (hoodCrime) => hoodCrime.nameNeighborhood == nameNeighborhood
  );

  if (!found) return "";

  return found.amount;
};

export const verifyChecked = (neighborhoodsSelected, nameNeighborhood) => {
  const found = neighborhoodsSelected.find(
    (hood) => hood.neighborhood == nameNeighborhood
  );

  return found.checked;
};
