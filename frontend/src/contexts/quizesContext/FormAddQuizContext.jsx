import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useQuizes } from "./QuizesContext";
import { useCookies } from "react-cookie";
import { useZoneCrimes } from "../zoneCrimesContext/ZoneCrimesContext.jsx";

import {
  alertSwalSuccess,
  alertSwalWarning
} from "../../components/sweetAlert/sweetAlert.js";
import {
  fetchGetAllTypeCrimes,
  fetchGetNeighborhoodsNotUsed,
  fetchSendQuiz
} from "./functionsFormAdd.js";

const FormAddQuizContext = createContext();

export const FormAddQuizProvider = ({ children }) => {
  const [cookies] = useCookies();
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [loadingNeigh, setLoadingNeigh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTypeCrimes, setAllTypeCrimes] = useState();
  const [neighborhoodsNotUsed, setNeighborhoodsNotUsed] = useState();
  const [valuesForm, setValuesForm] = useState({
    email: cookies && cookies.email ? cookies.email : "",
    neighborhoodSelected: "",
    perception: "",
    reasons: []
  });

  const {
    newQuiz,
    setNewQuiz,
    loadQuizesDataNeighborhoodsByYear,
    loadDataQuizes
  } = useQuizes();

  const { yearSelected } = useZoneCrimes();

  const getAllTypeCrimes = () =>
    fetchGetAllTypeCrimes(setLoadingCrimes, setAllTypeCrimes);

  const getNeighborhoodsNotUsed = () =>
    fetchGetNeighborhoodsNotUsed(setLoadingNeigh, setNeighborhoodsNotUsed);

  const cleanForm = () => {
    document.querySelector("form").reset();
    setValuesForm({
      email: cookies && cookies.email ? cookies.email : "",
      neighborhoodSelected: "",
      perception: "",
      reasons: []
    });
  };

  const handleClose = () => {
    setAllTypeCrimes();
    setNeighborhoodsNotUsed();
    cleanForm();
    setNewQuiz(false);
  };

  const validationsProps = (name, value) => {
    const validations = [
      {
        name: "email",
        validation: /\S+@\S+\.\S+/.test(value),
        msj: "Correo invalido"
      },
      {
        name: "neighborhoodSelected",
        validation: value.length > 0 && value != "Seleccionar",
        msj: "Debe seleccionar un barrio"
      },
      {
        name: "perception",
        validation: (value == 0 || value == 1) && typeof value == "number",
        msj: "Debe selccionar una percepcion"
      }
    ];

    let validationFound = validations.find(
      (validationItem) => validationItem.name == name
    );

    if (validationFound && !validationFound.validation)
      return validationFound.msj;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (const key of Object.keys(valuesForm)) {
      const msjError = validationsProps(key, valuesForm[key]);
      if (msjError) return alertSwalWarning(msjError);
    }

    const result = await fetchSendQuiz(setLoading, valuesForm);

    if (result) {
      if (yearSelected) loadQuizesDataNeighborhoodsByYear(yearSelected);
      else loadDataQuizes();

      cleanForm();
      alertSwalSuccess("¡Encuesta realizada exitosamente!");

      if (newQuiz == true) return getNeighborhoodsNotUsed();
    }
  };

  return (
    <FormAddQuizContext.Provider
      value={{
        getNeighborhoodsNotUsed,
        neighborhoodsNotUsed,
        allTypeCrimes,
        setAllTypeCrimes,
        loadingCrimes,
        setLoadingCrimes,
        loadingNeigh,
        loading,
        setLoading,
        getAllTypeCrimes,
        handleClose,
        handleSubmit,
        valuesForm,
        setValuesForm
      }}
    >
      {children}
    </FormAddQuizContext.Provider>
  );
};

export const useFormQuiz = () => useContext(FormAddQuizContext);
