import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useQuizes } from "./QuizesContext";
import {
  alertSwalSuccess,
  alertSwalWarning
} from "../../components/sweetAlert/sweetAlert.js";
import { useCookies } from "react-cookie";
import { fetchGetAllTypeCrimes, fetchSendQuiz } from "./fetchQuizes.js";
import { useZoneCrimes } from "../ZoneCrimesContext.jsx";

const FormAddQuizContext = createContext();

export const FormAddQuizProvider = ({ children }) => {
  const [cookies] = useCookies();
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTypeCrimes, setAllTypeCrimes] = useState();
  const [emailEntered, setEmailEntered] = useState();
  const [msjErrorEmail, setMsjErrorEmail] = useState();
  const [valuesForm, setValuesForm] = useState({
    email: cookies && cookies.email ? cookies.email : "",
    neighborhoodSelected: "",
    perception: "",
    reasons: []
  });
  const { setNewQuiz, loadQuizesDataNeighborhoodsByYear, loadDataQuizes } =
    useQuizes();
  const { yearSelected } = useZoneCrimes();

  const getAllTypeCrimes = () =>
    fetchGetAllTypeCrimes(setLoadingCrimes, setAllTypeCrimes);

  const handleEmailChanged = (email) => {
    let regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
      setMsjErrorEmail("Ingrese un correo valido");
    } else {
      setMsjErrorEmail();
    }

    setEmailEntered(email);
  };

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
    setMsjErrorEmail();
    setEmailEntered();
    setAllTypeCrimes();
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
        validation: value == 0 || value == 1,
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
    }
  };

  return (
    <FormAddQuizContext.Provider
      value={{
        allTypeCrimes,
        setAllTypeCrimes,
        loadingCrimes,
        setLoadingCrimes,
        loading,
        setLoading,
        getAllTypeCrimes,
        emailEntered,
        handleEmailChanged,
        msjErrorEmail,
        setMsjErrorEmail,
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
