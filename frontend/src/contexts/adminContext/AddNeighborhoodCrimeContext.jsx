import { createContext, useContext, useState } from "react";
import { alertSwalSuccess } from "../../components/sweetAlert/sweetAlert.js";
import { useCrud } from "./CrudContext.jsx";

const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;

const AddNeighborhoodCrimeContext = createContext();

export const AddNeighborhoodCrimeProvider = ({ children }) => {
  const { setRegisters, loadYears, fetchPostOrPut, fetchGet, crimes } =
    useCrud();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    neighborhoodsCrime: [],
    crime: crimes[0].category,
    file: null,
    year: ""
  });
  const [errors, setErrors] = useState({
    neighborhoodsCrime: "",
    file: "",
    crime: "",
    year: ""
  });

  const [neighborhoodsSelected, setNeighborhoodsSelected] = useState([]);

  const validationForm = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    let url;

    const errorsValues = validationForm();
    setErrors(errorsValues);

    if (Object.values(errorsValues).find((error) => error.length > 0)) {
      return;
    }
    const result = await fetchPostOrPut(
      "/neighborhoodCrimeAdmin/",
      "POST",
      setLoading,
      values
    );

    if (!result) return;

    alertSwalSuccess(
      "¡Denuncias de delito de" +
        values.crime +
        " en barrios agregados exitosamente!"
    );

    if (values.crime == crimeSelected) {
      if (values.year != yearSelected) {
        await loadYears(
          "/neighborhoodCrimeAdmin/yearsNeighborhoodsCrime/" + crimeSelected
        );
        url = "/neighborhoodCrimeAdmin/" + crimeSelected + "/" + values.year;
      } else {
        url = "/neighborhoodCrimeAdmin/" + crimeSelected + "/" + yearSelected;
      }
      let nhCrimes = await fetchGet(url);
      setRegisters(nhCrimes);
    }

    return;
  };

  const cleanValues = () => {
    document.querySelector("form").reset();
    setValues({
      neighborhoodsCrime: values.neighborhoodsCrime.map(
        (neighborhoodCrime) => ({
          ...neighborhoodCrime,
          amount: null
        })
      ),
      crime: "",
      year: ""
    });
  };

  return (
    <AddNeighborhoodCrimeContext.Provider
      value={{
        handleSubmit,
        errors,
        setErrors,
        values,
        setValues,
        loading,
        setLoading,
        neighborhoodsSelected,
        setNeighborhoodsSelected
      }}
    >
      {children}
    </AddNeighborhoodCrimeContext.Provider>
  );
};

export const useAddNeighborhoodCrime = () =>
  useContext(AddNeighborhoodCrimeContext);
