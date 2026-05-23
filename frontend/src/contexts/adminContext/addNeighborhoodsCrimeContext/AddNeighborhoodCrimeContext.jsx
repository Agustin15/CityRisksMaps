import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCrud } from "../CrudContext.jsx";
import { useAuth } from "../AuthContext.jsx";
import { alertSwalSuccess } from "../../../components/sweetAlert/sweetAlert.js";
import {
  fetchGetAmountsOfAnCrimeInNeighborhoodsByYear,
  fetchGetNeighborhoodsCrimeFromFile,
  replaceNeighborhoodsCrimeWithValuesFound,
  validationForm,
  validationLoadFromFile
} from "./functions.js";

const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;

const AddNeighborhoodCrimeContext = createContext();

export const AddNeighborhoodCrimeProvider = ({ children }) => {
  const {
    setRegisters,
    loadYears,
    yearSelected,
    fetchPostOrPut,
    fetchGet,
    index,
    setIndex,
    setPages,
    crimes,
    crimeSelected
  } = useCrud();

  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const refCheckboxSelectAll = useRef();

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

  const getAmountsOfAnCrimeInNeighborhoodsByYear = async () => {
    const valuesToSend = {
      crime: values.crime,
      year: values.year,
      neighborhoodsCrimeToGet: values.neighborhoodsCrime.filter(
        (hoodCrime) => hoodCrime.amount != null
      )
    };

    const errorsValues = validationForm(valuesToSend);
    if (valuesToSend.neighborhoodsCrimeToGet.length == 0)
      errorsValues["neighborhoodsCrime"] =
        "*Debe seleccionar al menos un barrio para la busqueda";

    setErrors(errorsValues);

    if (Object.values(errorsValues).some((error) => error.length > 0)) return;

    const result = await fetchGetAmountsOfAnCrimeInNeighborhoodsByYear(
      setLoadingSearch,
      setUser,
      valuesToSend
    );

    if (!result) return;

    const neighborhoodCrimeWithNewValues =
      replaceNeighborhoodsCrimeWithValuesFound(result, values);

    setValues({
      ...values,
      neighborhoodsCrime: neighborhoodCrimeWithNewValues
    });
  };

  const handleSubmit = async (event, method) => {
    event.preventDefault();

    const valuesToSend = {
      crime: values.crime,
      year: values.year,
      neighborhoodsCrime: values.neighborhoodsCrime.filter(
        (hoodCrime) => hoodCrime.amount != null
      )
    };

    const errorsValues = validationForm(valuesToSend);
    setErrors(errorsValues);

    if (Object.values(errorsValues).find((error) => error.length > 0)) {
      return;
    }

    const result = await fetchPostOrPut(
      "/neighborhoodCrime/",
      method,
      setLoading,
      valuesToSend
    );

    if (!result) return;

    alertSwalSuccess(
      `¡Denuncias de delito de ${values.crime} en barrios 
      ${values.method == "POST" ? " agregados" : " actualizados"} exitosamente!`
    );

    await loadDataAfterChanges();

    setValues({
      ...values,
      neighborhoodsCrime: values.neighborhoodsCrime.map((hoodCrime) => {
        return { ...hoodCrime, amount: null };
      })
    });

    return;
  };

  const loadDataAfterChanges = async () => {
    if (values.crime == crimeSelected) {
      let url =
        "/neighborhoodCrime/neighborhoodsCrimesByYearOffset/" +
        crimeSelected +
        "/" +
        values.year;

      if (values.year != yearSelected) {
        await loadYears(
          "/neighborhoodCrime/yearsNeighborhoodsCrime/" + crimeSelected
        );
        url += "/0";
        setIndex(0);
      } else {
        url += "/" + index * 10;
      }
      let nhCrimes = await fetchGet(url);
      if (nhCrimes) {
        setRegisters(nhCrimes.registersOffset);
        setPages(nhCrimes.pages);
      }
    }
  };

  const cleanValues = () => {
    document.querySelector("form").reset();
    refCheckboxSelectAll.current.checked = false;

    setValues({
      neighborhoodsCrime: values.neighborhoodsCrime.map((hoodCrime) => {
        return { ...hoodCrime, amount: null };
      }),
      crime: "",
      year: ""
    });
  };

  return (
    <AddNeighborhoodCrimeContext.Provider
      value={{
        getAmountsOfAnCrimeInNeighborhoodsByYear,
        handleSubmit,
        cleanValues,
        errors,
        setErrors,
        values,
        setValues,
        loading,
        setLoading,
        loadingSearch,
        setLoadingSearch,
        refCheckboxSelectAll
      }}
    >
      {children}
    </AddNeighborhoodCrimeContext.Provider>
  );
};

export const useAddNeighborhoodCrime = () =>
  useContext(AddNeighborhoodCrimeContext);
