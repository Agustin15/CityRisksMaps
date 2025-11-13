import { createContext, useContext, useState } from "react";
import { useMapControls } from "./MapContext";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const QuizesContext = createContext();

export const QuizesProvider = ({ children }) => {
  const [showQuizes, setShowQuizes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingQuizes, setLoadingQuizes] = useState(false);
  const [neighborhoodsQuizesByYear, setNeighborhoodsQuizesByYear] = useState();
  const [years, setYears] = useState();
  const [yearSelected, setYearSelected] = useState();
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

    const url = `${localhostBackend}/${optionGet}`;

    return await fetchEndpoint(url, "GET", setLoading);
  };

  const getQuizesNeighbordhoodByYear = async (year) => {
    const optionGet = JSON.stringify({
      option: "getQuizesNeighbordhoodByYear",
      year: year
    });

    const url = `${localhostBackend}/${optionGet}`;

    return await fetchEndpoint(url, "GET", setLoadingQuizes);
  };

  const loadQuizesDataNeighborhoodsByYear = async (year) => {
    const quizes = await getQuizesNeighbordhoodByYear(year);

    setNeighborhoodsQuizesByYear(quizes);
  };

  const loadDataQuizes = async () => {
    const years = await getQuizesYears();

    if (years) {
      setYearSelected(years[0]);
      setYears(years);
      loadQuizesDataNeighborhoodsByYear(years[0]);
    }
  };

  return (
    <QuizesContext.Provider
      value={{
        neighborhoodsQuizesByYear,
        loading,
        loadingQuizes,
        years,
        yearSelected,
        showQuizes,
        setShowQuizes,
        loadDataQuizes
      }}
    >
      {children}
    </QuizesContext.Provider>
  );
};

export const useQuizes = () => useContext(QuizesContext);
