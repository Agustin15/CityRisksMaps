import { createContext, useContext, useState } from "react";
import { useMapControls } from "../MapContext";
import { useZoneCrimes } from "../ZoneCrimesContext";
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
    createPolygonsNeighbordhood(quizes);
  };

  const loadDataQuizes = async () => {
    const years = await getQuizesYears();
    if (years) {
      setYearSelected(years[0].year);
      setYears(years);
      loadQuizesDataNeighborhoodsByYear(years[0].year);
    }
  };

  const getRangeSecureQuiz = (percentage) => {
    switch (true) {
      case percentage >= 80:
        return { color: "#ffffbfff", level: "Seguro" };
      case percentage >= 60 && percentage < 80:
        return { color: "#f1f134ff", level: "Medio seguro" };
      case percentage >= 40 && percentage < 60:
        return { color: "#f77963ff", level: "Inseguro" };
      case percentage >= 20 && percentage < 40:
        return { color: "#f7491eff", level: "Muy inseguro" };
      case percentage >= 0 && percentage < 20:
        return { color: "#ee2f29ff", level: "Extramadamente inseguro" };
    }
  };

  const createArrayForPolygons = (nhQuizes) => {
    const neighbordhoodsDataForPolygons = [];

    neighbordhoodsCoordinates.forEach((nhCoordinate) => {
      const nhQuizFound = nhQuizes.find(
        (nhQuiz) =>
          nhQuiz.name.toLowerCase() == nhCoordinate.neighborhood.toLowerCase()
      );

      if (nhQuizFound) {
        let rateColor =
          nhQuizFound.total == 0
            ? "#bbbbbbff"
            : getRangeSecureQuiz(nhQuizFound.percentage).color;

        neighbordhoodsDataForPolygons.push({
          rateColor: rateColor,
          coordinates: nhCoordinate.coordinates,
          name: nhQuizFound.name,
          total: nhQuizFound.total,
          percentage: nhQuizFound.percentage,
          type: "quiz"
        });
      }
    });

    return neighbordhoodsDataForPolygons;
  };

  const createPolygonsNeighbordhood = (nhQuizes) => {
    if (polygons.length > 0)
      polygons.forEach((polygon) => {
        polygon.setMap(null);
      });

    const polygonsCreated = [];
    const neighbordhoodsDataForPolygons = createArrayForPolygons(nhQuizes);

    neighbordhoodsDataForPolygons.forEach((nhData) => {
      const polygon = new google.maps.Polygon({
        paths: nhData.coordinates,
        strokeColor: "#8d8d8dff",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: nhData.rateColor,
        fillOpacity: 0.4,
        clickable: false,
        data: nhData
      });
      polygon.setMap(map);

      polygonsCreated.push(polygon);
    });

    setPolygons(polygonsCreated);
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
