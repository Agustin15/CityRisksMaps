import {
  createPolygonsNeighbordhood,
  getRangeSecureQuiz
} from "./functionsCreatePolygons.js";
import { createContext, useContext, useState } from "react";
import { useMapControls } from "../MapContext";
import { useZoneCrimes } from "../zoneCrimesContext/ZoneCrimesContext";
import { useMap } from "@vis.gl/react-google-maps";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const QuizesContext = createContext();

export const QuizesProvider = ({ children }) => {
  const [showQuizes, setShowQuizes] = useState(false);
  const [loadingQuizes, setLoadingQuizes] = useState(false);
  const [neighborhoodsQuizesByYear, setNeighborhoodsQuizesByYear] = useState();
  const [newQuiz, setNewQuiz] = useState(false);
  const [errorGetQuiz, setErrorGetQuiz] = useState(false);
  const [showListQuizes, setShowListQuizes] = useState(false);
  const map = useMap();

  const { setYears, setYearSelected, setLoadingYears, setPolygons, polygons } =
    useZoneCrimes();
  const { neighbordhoodsCoordinates } = useMapControls();

  const fetchEndpoint = async (url, method, setLoading) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);

      return result;
    } catch (error) {
      setErrorGetQuiz(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getQuizesYears = async () => {
    const optionGet = JSON.stringify({ option: "getQuizesYears" });

    const url = `${localhostBackend}/quiz/${optionGet}`;

    return await fetchEndpoint(url, "GET", setLoadingYears);
  };

  const getQuizesNeighbordhoodByYear = async (year) => {
    const optionGet = JSON.stringify({
      option: "getQuizesNeighbordhoodByYear",
      year: year
    });

    const url = `${localhostBackend}/quiz/${optionGet}`;

    return await fetchEndpoint(url, "GET", setLoadingQuizes);
  };

  const loadQuizesDataNeighborhoodsByYear = async (year) => {
    const quizes = await getQuizesNeighbordhoodByYear(year);
    setNeighborhoodsQuizesByYear(quizes);
    createPolygonsNeighbordhood(
      quizes,
      neighbordhoodsCoordinates,
      polygons,
      setPolygons,
      map
    );
  };

  const loadDataQuizes = async () => {
    const years = await getQuizesYears();
    if (years) {
      setYearSelected(years[0].year);
      setYears(years);
      loadQuizesDataNeighborhoodsByYear(years[0].year);
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
        getRangeSecureQuiz,
        setNewQuiz,
        newQuiz,
        showListQuizes,
        setShowListQuizes,
        errorGetQuiz,
        setErrorGetQuiz
      }}
    >
      {children}
    </QuizesContext.Provider>
  );
};

export const useQuizes = () => useContext(QuizesContext);
