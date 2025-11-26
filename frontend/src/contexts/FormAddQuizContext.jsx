import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useQuizes } from "./QuizesContext";
import { alertSwalWarning } from "../components/sweetAlert/sweetAlert.js";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const FormAddQuizContext = createContext();

export const FormAddQuizProvider = ({ children }) => {
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [allTypeCrimes, setAllTypeCrimes] = useState();
  const [emailEntered, setEmailEntered] = useState();
  const [perceptionSelected, setPerceptionSelected] = useState();
  const [msjErrorEmail, setMsjErrorEmail] = useState();
  const [checked, setChecked] = useState([]);
  const { setNewQuiz } = useQuizes();

  const fetchGetAllTypeCrimes = async () => {
    const optionGet = JSON.stringify({ option: "getAllTypeCrimes" });

    setLoadingCrimes(true);
    try {
      const response = await fetch(localhostBackend + "/crimes/" + optionGet, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);

      if (result) setAllTypeCrimes(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCrimes(false);
    }
  };

  const handleEmailChanged = (email) => {
    let regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
      setMsjErrorEmail("Ingrese un correo valido");
    } else {
      setMsjErrorEmail();
    }

    setEmailEntered(email);
  };

  const handleClose = () => {
    setMsjErrorEmail();
    setChecked();
    setEmailEntered();
    setAllTypeCrimes();
    setNewQuiz(false);
  };

  const validationInput = (key, value) => {
    switch (key) {
      case "email":
        let regexEmail = /\S+@\S+\.\S+/;
        if (!regexEmail.test(value)) return "Ingresa un correo valido";
        break;
      case "neighborhood":
        if (value.length == 0) return "Debe seleccionar un barrio";
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const quiz = { email: "", neighborhood: "", perception: "", reasons: "" };
    let msjError;

    const formData = new FormData(event.target);

    for (const [key, value] of formData) {
      msjError = validationInput(key, value);
      if (msjError) {
        return alertSwalWarning(msjError);
      }
      quiz[key] = value;
    }

    if (!perceptionSelected)
      return alertSwalWarning("Debe seleccionar una percepcion");

    quiz.perception = perceptionSelected == "secure" ? true : false;

    if (checked.length == 0) {
      return alertSwalWarning("Debe seleccionar al menos una razon");
    }

    quiz.reasons = checked;

    console.log(quiz);
  };

  return (
    <FormAddQuizContext.Provider
      value={{
        allTypeCrimes,
        setAllTypeCrimes,
        loadingCrimes,
        setLoadingCrimes,
        fetchGetAllTypeCrimes,
        checked,
        setChecked,
        emailEntered,
        handleEmailChanged,
        msjErrorEmail,
        setMsjErrorEmail,
        handleClose,
        handleSubmit,
        setPerceptionSelected
      }}
    >
      {children}
    </FormAddQuizContext.Provider>
  );
};

export const useFormQuiz = () => useContext(FormAddQuizContext);
