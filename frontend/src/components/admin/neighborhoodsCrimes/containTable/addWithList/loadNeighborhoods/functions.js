export const handleChange = (event, neighborhoodName, values, setValues) => {
  const newNeighborhoodsCrime = values.neighborhoodsCrime.map((nhCrime) => {
    if (nhCrime.nameNeighborhood == neighborhoodName) {
      if (event.target.value != null && event.target.value.length == 0) {
        nhCrime.amount = null;
      } else nhCrime.amount = event.target.value;
    }

    return nhCrime;
  });

  setValues({
    ...values,
    ["neighborhoodsCrime"]: newNeighborhoodsCrime
  });
};

export const handleCheckbox = (neighborhoodName, setNeighborhoodsSelected) => {
  setNeighborhoodsSelected(
    neighborhoodsSelected.map((hoodSelected) =>
      hoodSelected.neighborhood == neighborhoodName
        ? { ...hoodSelected, checked: hoodSelected.checked ? false : true }
        : hoodSelected
    )
  );
};

export const verifyInputEnable = (neighborhoodName, neighborhoodsSelected) => {
  return neighborhoodsSelected.find(
    (hood) => hood.neighborhood == neighborhoodName
  ).checked;
};
