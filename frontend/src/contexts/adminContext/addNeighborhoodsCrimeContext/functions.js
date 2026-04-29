const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import { alertSwalErrorAdmin } from "../../../components/sweetAlert/sweetAlert.js";

export const fetchGetNeighborhoodsCrimeFromFile = async (
  setLoadingFromFile,
  values,
  setUser
) => {
  setLoadingFromFile(true);

  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    if (key == "neighborhoodsSelected") {
      values[key].map((neighborhood) =>
        formData.append("neighborhoodsSelected[]", neighborhood)
      );
    } else formData.append(key, values[key]);
  });

  try {
    const response = await fetch(
      LOCALHOST_BACKEND +
        "/neighborhoodCrimeAdmin/loadNeighborhoodsCrimeFromFile/",
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status == 401) {
        setUser();
        location.href = LOCALHOST_FRONTEND + "/admin/login";
      } else throw new Error(result.messageError);
    }

    return result;
  } catch (error) {
    alertSwalErrorAdmin(
      "Ups, error al cargar datos a partir del archivo subido",
      error.message
    );
  } finally {
    setLoadingFromFile(false);
  }
};

export const validationLoadFromFile = (values) => {
  let errorsValues = {
    crime: "",
    year: "",
    neighborhoodsCrime: "",
    file: ""
  };

  if (values.crime.length == 0) {
    errorsValues["crime"] = "*Debe ingresar categoria de crimen";
  }
  if (values.year.length == 0) {
    errorsValues["year"] = "*Debe ingresar el año";
  }
  if (!values.file) {
    errorsValues["file"] = "*Debe indicar un archivo";
  }

  if (values.neighborhoodsSelected.length == 0) {
    errorsValues["neighborhoodsCrime"] =
      "*Debe indicar al menos un barrio para buscar la informacion";
  }

  return errorsValues;
};

export const validationForm = (valuesToAdd) => {
  let errorsValues = {
    crime: "",
    year: "",
    neighborhoodsCrime: ""
  };

  if (valuesToAdd.crime.length == 0) {
    errorsValues["crime"] = "*Debe ingresar categoria de crimen";
  }
  if (valuesToAdd.year.length == 0) {
    errorsValues["year"] = "*Debe ingresar el año";
  }
  if (
    valuesToAdd.neighborhoodsCrime.length == 0 ||
    valuesToAdd.neighborhoodsCrime.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0
    ) == 0
  ) {
    errorsValues["neighborhoodsCrime"] =
      "*Debe indicar al menos un delito de barrio";
  }

  return errorsValues;
};
