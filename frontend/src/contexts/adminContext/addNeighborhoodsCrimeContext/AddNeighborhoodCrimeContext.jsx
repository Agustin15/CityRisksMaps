import { createContext, useContext, useRef, useState } from "react";
import { useCrud } from "../CrudContext.jsx";
import { useAuth } from "../AuthContext.jsx";
import { alertSwalSuccess } from "../../../components/sweetAlert/sweetAlert.js";
import {
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

  const handleLoadCrimesFromFile = async () => {
    let selectedNeighborhoods = neighborhoodsSelected.filter(
      (neighborhood) => neighborhood.checked == true
    );

    if (selectedNeighborhoods.length > 0) {
      selectedNeighborhoods = selectedNeighborhoods.map(
        (hood) => hood.neighborhood
      );
    }

    const valuesLoadFile = {
      file: values.file,
      department: "Montevideo",
      crime: values.crime,
      year: values.year,
      neighborhoodsSelected: selectedNeighborhoods
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

    return;
  };

  const cleanValues = () => {
    document.querySelector("form").reset();
    setValues({
      neighborhoodsCrime: [],
      crime: "",
      year: ""
    });
  };

  return (
    <AddNeighborhoodCrimeContext.Provider
      value={{
        handleSubmit,
        handleLoadCrimesFromFile,
        cleanValues,
        errors,
        setErrors,
        values,
        setValues,
        loading,
        setLoading,
        setLoadingFromFile,
        loadingFromFile,
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
