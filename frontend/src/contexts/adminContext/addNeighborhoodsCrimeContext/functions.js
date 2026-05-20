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
    if (key == "neighborhoodsCrimeToSelect") {
      values[key].map((neighborhoodCrimeToSelect) =>
        formData.append(
          "neighborhoodsCrimeToSelect[]",
          JSON.stringify(neighborhoodCrimeToSelect)
        )
      );
    } else formData.append(key, values[key]);
  });

  try {
    const response = await fetch(
      LOCALHOST_BACKEND +
        "/admin/neighborhoodCrime/loadNeighborhoodsCrimeFromFile/",
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
      error.message || "Error en la solicitud"
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

  if (values.neighborhoodsCrimeToSelect.length == 0) {
    errorsValues["neighborhoodsCrime"] =
      "*Debe indicar al menos un barrio para buscar la informacion";
  }

  return errorsValues;
};

export const validationForm = (valuesToSend) => {
  let errorsValues = {
    crime: "",
    year: "",
    neighborhoodsCrime: ""
  };

  switch (true) {
    case valuesToSend.crime.length == 0:
      errorsValues["crime"] = "*Debe ingresar categoria de crimen";

    case valuesToSend.year.length == 0:
      errorsValues["year"] = "*Debe ingresar el año";

    case valuesToSend.neighborhoodsCrime &&
      valuesToSend.neighborhoodsCrime.length == 0:
      errorsValues["neighborhoodsCrime"] =
        "*Debe indicar al menos un delito de barrio";

    case valuesToSend.neighborhoodsCrimeToGet &&
      valuesToSend.neighborhoodsCrimeToGet.length == 0:
      errorsValues["neighborhoodsCrime"] =
        "*Debe indicar al menos un barrio para buscar la informacion";
  }

  return errorsValues;
};

export const fetchGetAmountsOfAnCrimeInNeighborhoodsByYear = async (
  setLoadingSearch,
  setUser,
  values
) => {
  const url =
    LOCALHOST_BACKEND +
    "/admin/neighborhoodCrime/amountAnCrimeInNeighborhoodByYear/" +
    values.crime +
    "/" +
    values.year +
    "/" +
    JSON.stringify(values.neighborhoodsCrimeToGet);

  setLoadingSearch(true);
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

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
      "Ups,hubo un error en la busqueda de los datos",
      error.message || "Error en la solicitud"
    );
  } finally {
    setLoadingSearch(false);
  }
};

export const replaceNeighborhoodsCrimeWithValuesFound = (result, values) => {
  return values.neighborhoodsCrime.map((hoodCrime) => {
    const found = result.find(
      (item) => item.idNeighborhood == hoodCrime.idNeighborhood
    );
    if (found) {
      return found;
    } else return hoodCrime;
  });
};
