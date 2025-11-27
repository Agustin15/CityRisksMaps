import { createContext, useContext, useState } from "react";
import { useMapControls } from "./MapContext";
import { useZoneCrimes } from "./ZoneCrimesContext";
import { useMap } from "@vis.gl/react-google-maps";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const QuizesContext = createContext();

export const QuizesProvider = ({ children }) => {
  const [showQuizes, setShowQuizes] = useState(false);
  const [loadingQuizes, setLoadingQuizes] = useState(false);
  const [neighborhoodsQuizesByYear, setNeighborhoodsQuizesByYear] = useState();
  const [newQuiz, setNewQuiz] = useState(false);
  const map = useMap();

  const { setYears, setYearSelected, setLoadingYears, setPolygons } =
    useZoneCrimes();
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
        return "#ffffbfff";
      case percentage >= 60 && percentage < 80:
        return "#f1f134ff";
      case percentage >= 40 && percentage < 60:
        return "#f77963ff";
      case percentage >= 20 && percentage < 40:
        return "#f7491eff";
      case percentage >= 0 && percentage < 20:
        return "#ee2f29ff";
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
        neighbordhoodsDataForPolygons.push({
          rateColor:
            nhQuizFound.total == 0
              ? "#bbbbbbff"
              : getRangeSecureQuiz(nhQuizFound.percentage),
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
    const polygons = [];
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

      polygons.push(polygon);
    });

    setPolygons(polygons);
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
        newQuiz
      }}
    >
      {children}
    </QuizesContext.Provider>
  );
};

export const useQuizes = () => useContext(QuizesContext);
