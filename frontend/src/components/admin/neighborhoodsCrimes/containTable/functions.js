export const validationForm = (values) => {
  let errorsValues = {
    crime: "",
    year: "",
    neighborhoodsCrime: ""
  };

  if (values.crime.length == 0) {
    errorsValues["crime"] = "*Debe ingresar categoria de crimen";
  }
  if (values.year.length == 0) {
    errorsValues["year"] = "*Debe ingresar el año";
  }
  if (
    values.neighborhoodsCrime.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0
    ) == 0
  ) {
    errorsValues["neighborhoodsCrime"] =
      "*Debe indicar al menos un delito de barrio";
  }

  return errorsValues;
};
