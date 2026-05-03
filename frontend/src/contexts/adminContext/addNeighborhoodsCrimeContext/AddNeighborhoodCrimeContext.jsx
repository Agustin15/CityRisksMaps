import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCrud } from "../CrudContext.jsx";
import { useAuth } from "../AuthContext.jsx";
import { alertSwalSuccess } from "../../../components/sweetAlert/sweetAlert.js";
import {
  fetchGetAmountsOfAnCrimeInNeighborhoodsByYear,
  fetchGetNeighborhoodsCrimeFromFile,
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
    setIndex,
    crimes,
    crimeSelected
  } = useCrud();
  const { setUser } = useAuth();

  const [loadingFromFile, setLoadingFromFile] = useState(false);
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

  const handleLoadCrimesFromFile = async () => {
    const valuesLoadFile = {
      file: values.file,
      department: "Montevideo",
      crime: values.crime,
      year: values.year,
      neighborhoodsCrimeToSelect: values.neighborhoodsCrime.filter(
        (hoodCrime) => hoodCrime.amount != null
      )
    };

    const errorsValues = validationLoadFromFile(valuesLoadFile);
    setErrors(errorsValues);

    if (Object.values(errorsValues).some((error) => error.length > 0)) {
      return;
    }

    const result = await fetchGetNeighborhoodsCrimeFromFile(
      setLoadingFromFile,
      valuesLoadFile,
      setUser
    );

    if (result) {
      setValues({ ...values, neighborhoodsCrime: result });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const valuesToAdd = {
      crime: values.crime,
      neighborhoodsCrime: values.neighborhoodsCrime,
      year: values.year
    };

    const errorsValues = validationForm(valuesToAdd);
    setErrors(errorsValues);

    if (Object.values(errorsValues).find((error) => error.length > 0)) {
      return;
    }

    const result = await fetchPostOrPut(
      "/neighborhoodCrimeAdmin/",
      "POST",
      setLoading,
      valuesToAdd
    );

    if (!result) return;

    alertSwalSuccess(
      "¡Denuncias de delito de " +
        values.crime +
        " en barrios agregados exitosamente!"
    );

    if (values.crime == crimeSelected) {
      let url;
      if (values.year != yearSelected) {
        await loadYears(
          "/neighborhoodCrimeAdmin/yearsNeighborhoodsCrime/" + crimeSelected
        );
        url = "/neighborhoodCrimeAdmin/" + crimeSelected + "/" + values.year;
        setIndex(0);
      } else {
        url = "/neighborhoodCrimeAdmin/" + crimeSelected + "/" + yearSelected;
      }
      let nhCrimes = await fetchGet(url);
      setRegisters(nhCrimes);
    }

    setValues({
      ...values,
      neighborhoodsCrime: values.neighborhoodsCrime.map((hoodCrime) => {
        return { ...hoodCrime, amount: null };
      })
    });
    return;
  };

  const getAmountsOfAnCrimeInNeighborhoodsByYear = async () => {
    setLoadingSearch(true);

    const result = await fetchGetAmountsOfAnCrimeInNeighborhoodsByYear(
      setUser,
      values
    );

    if (result) setValues({ ...values, neighborhoodsCrime: result });

    setLoadingSearch(false);
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
        handleSubmit,
        handleLoadCrimesFromFile,
        getAmountsOfAnCrimeInNeighborhoodsByYear,
        cleanValues,
        errors,
        setErrors,
        values,
        setValues,
        loading,
        setLoading,
        setLoadingFromFile,
        loadingFromFile,
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
