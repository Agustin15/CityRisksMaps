import { createContext, useContext, useState } from "react";
import { useMapControls } from "./MapContext";
import { useZoneCrimes } from "./ZoneCrimesContext";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const QuizesContext = createContext();

export const QuizesProvider = ({ children }) => {
  const [showQuizes, setShowQuizes] = useState(false);
  const [loadingQuizes, setLoadingQuizes] = useState(false);
  const [neighborhoodsQuizesByYear, setNeighborhoodsQuizesByYear] = useState();

  const { setYears, setYearSelected, setLoadingYears } = useZoneCrimes();
  const { neighbordhoodsCoordinates } = useMapControls();

  const fetchEndpoint = async (url, method, setLoading) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json"
        }
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);

      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizesYears = async () => {
    const optionGet = JSON.stringify({ option: "getQuizesYears" });

    const url = `${localhostBackend}/quizes/${optionGet}`;

    return await fetchEndpoint(url, "GET", setLoadingYears);
  };

  const getQuizesNeighbordhoodByYear = async (year) => {
    const optionGet = JSON.stringify({
      option: "getQuizesNeighbordhoodByYear",
      year: year
    });

    const url = `${localhostBackend}/quizes/${optionGet}`;

    return await fetchEndpoint(url, "GET", setLoadingQuizes);
  };

  const loadQuizesDataNeighborhoodsByYear = async (year) => {
    const quizes = await getQuizesNeighbordhoodByYear(year);

    setNeighborhoodsQuizesByYear(quizes);
  };

  const loadDataQuizes = async () => {
    const years = await getQuizesYears();
    if (years) {
      setYearSelected(years[0].year);
      setYears(years);
      loadQuizesDataNeighborhoodsByYear(years[0].year);
    }
  };

  const getRangeSecureQuiz = (percentaje) => {
    switch (true) {
      case percentaje >= 80:
        return "#ffffbfff";
      case percentaje >= 60 && percentaje < 80:
        return "#f1f134ff";
      case percentaje >= 40 && percentaje < 60:
        return "#f77963ff";
      case percentaje >= 20 && percentaje < 40:
        return "#d45129ff";
      case percentaje >= 0 && percentaje < 20:
        return "#ee2f29ff";
    }
  };

  return (
    <QuizesContext.Provider
      value={{
        neighborhoodsQuizesByYear,
        setNeighborhoodsQuizesByYear,
        loadingQuizes,
        showQuizes,
        setShowQuizes,
        loadDataQuizes,
        loadQuizesDataNeighborhoodsByYear,
        getRangeSecureQuiz
      }}
    >
      {children}
    </QuizesContext.Provider>
  );
};

export const useQuizes = () => useContext(QuizesContext);
