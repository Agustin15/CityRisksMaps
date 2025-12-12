import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { alertSwalErrorQuiz } from "../../components/sweetAlert/sweetAlert";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const ListQuizesContext = createContext();

export const ListQuizesProvider = ({ children }) => {
  const [cookies] = useCookies();
  const [years, setYears] = useState();
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingQuizes, setLoadingQuizes] = useState(false);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState();
  const [errorSearch, setErrorSearch] = useState();
  const [resultQuizes, setResultQuizes] = useState();
  const refSelectYear = useRef();

  const fetchEndpoint = async (setLoading, endpoint) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);

      return result;
    } catch (error) {
      setErrorSearch(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getYearsParticipantQuizes = async () => {
    const optionGet = JSON.stringify({
      option: "getYearsOfParticipantQuizes",
      participantEmail: cookies.email
    });

    const endpoint = localhostBackend + "/quiz/" + optionGet;

    const years = await fetchEndpoint(setLoadingYears, endpoint);

    if (years) setYears(years);

    return years;
  };

  const getQuizesByParticipantAndYear = async (year) => {
    const optionGet = JSON.stringify({
      option: "getQuizesByParticipantAndYear",
      participantEmail: cookies.email,
      year: year
    });

    const endpoint = localhostBackend + "/quiz/" + optionGet;

    const quizes = await fetchEndpoint(setLoadingQuizes, endpoint);
    return quizes;
  };

  const getLimitQuizesByParticipantAndYear = async (year, newIndex) => {
    const optionGet = JSON.stringify({
      option: "getLimitQuizesByParticipantAndYear",
      participantEmail: cookies.email,
      year: year,
      offset: newIndex * 10
    });

    const endpoint = localhostBackend + "/quiz/" + optionGet;

    const quizesLimit = await fetchEndpoint(setLoadingQuizes, endpoint);

    if (quizesLimit) setResultQuizes(quizesLimit);
  };

  const loadInitData = async () => {
    const years = await getYearsParticipantQuizes();

    if (years) {
      loadQuizes(years[0].year, 0);
    }
  };

  const loadQuizes = async (year, index) => {
    setPages();
    const quizes = await getQuizesByParticipantAndYear(year);

    if (quizes) {
      setPages(Math.ceil(quizes.length / 10));
      await getLimitQuizesByParticipantAndYear(year, index);
    }
  };

  const deleteQuiz = async (idQuiz) => {
    let endpoint = localhostBackend + "/quiz/" + idQuiz;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);

      return result;
    } catch (error) {
      console.log(error);
      alertSwalErrorQuiz("Error al eliminar encuesta", error.messageError);
    }
  };

  return (
    <ListQuizesContext.Provider
      value={{
        loadInitData,
        loadQuizes,
        getLimitQuizesByParticipantAndYear,
        deleteQuiz,
        refSelectYear,
        resultQuizes,
        loadingYears,
        loadingQuizes,
        years,
        index,
        setIndex,
        pages,
        errorSearch
      }}
    >
      {children}
    </ListQuizesContext.Provider>
  );
};

export const useListQuizes = () => useContext(ListQuizesContext);
