import { alertSwalErrorQuiz } from "../../components/sweetAlert/sweetAlert.js";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const fetchGetNeighborhoodsNotUsed = async (
  setLoadingNeighborhood,
  setNeighborhoodsNotUsed
) => {
  setLoadingNeighborhood(true);

  const optionGet = JSON.stringify({
    option: "getNeighborhoodsWithoutQuizByYear",
    year: new Date().getFullYear()
  });

  try {
    const response = await fetch(
      localhostBackend + "/neighborhood/" + optionGet,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
    );
    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);

    if (result) {
      setNeighborhoodsNotUsed(result);
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    setLoadingNeighborhood(false);
  }
};

export const fetchGetAllTypeCrimes = async (
  setLoadingCrimes,
  setAllTypeCrimes
) => {
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
    console.log(error.message);
  } finally {
    setLoadingCrimes(false);
  }
};

export const fetchSendQuiz = async (setLoading, valuesForm) => {
  setLoading(true);
  try {
    const response = await fetch(localhostBackend + "/quiz/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(valuesForm)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);

    return result;
  } catch (error) {
    alertSwalErrorQuiz(
      "Ups, hubo un error al realizar la encuesta",
      error.message
    );
  } finally {
    setLoading(false);
  }
};
