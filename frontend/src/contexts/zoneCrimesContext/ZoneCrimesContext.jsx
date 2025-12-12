import {
  defineCrimeRate,
  getCrimeRange,
  createPolygonsNeighbordhood
} from "./functionsCreatePolygons.js";

import { useContext, useState } from "react";
import { createContext } from "react";
import { useMapControls } from "../MapContext.jsx";
import { useMap } from "@vis.gl/react-google-maps";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const ZoneCrimesContext = createContext();

export const ZoneCrimesProvider = ({ children }) => {
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingNeighborhoodsCrime, setLoadingNeighborhoodsCrime] =
    useState(false);
  const [polygons, setPolygons] = useState([]);
  const [yearSelected, setYearSelected] = useState();
  const [years, setYears] = useState();
  const [neighborhoodsCrimeByYear, setNeighborhoodsCrimeByYear] = useState();
  const { neighbordhoodsCoordinates } = useMapControls();
  const [indexChartActive, setIndexChartActive] = useState(null);

  const map = useMap();

  const fetchEndpoint = async (url, setLoading) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-type": "application/json" }
      });

      const result = await response.json();

      if (!response.ok) throw result.messageError;

      if (result) return result;
      else return null;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNeighborhoodsCrimeByYear = async (year, categoryCrime) => {
    let optionGET = JSON.stringify({
      option: "getNeighborhoodsCrimeByYear",
      year: year,
      categoryCrime: categoryCrime
    });

    const url = localhostBackend + "/neighborhoodCrime/" + optionGET;
    return await fetchEndpoint(url, setLoadingNeighborhoodsCrime);
  };

  const getYearsNeighborhoodsCrime = async (categoryCrime) => {
    let optionGET = JSON.stringify({
      option: "getYearsNeighborhoodsCrime",
      categoryCrime: categoryCrime
    });

    const url = localhostBackend + "/neighborhoodCrime/" + optionGET;
    return await fetchEndpoint(url, setLoadingYears);
  };

  const loadCrimesByYear = async (year, categoryCrime) => {
    if (polygons.length > 0) {
      polygons.forEach((polygon) => {
        polygon.setMap(null);
      });
      setPolygons([]);
    }

    setYearSelected(year);
    let neighborhoodsCrime = await getNeighborhoodsCrimeByYear(
      year,
      categoryCrime
    );

    if (neighborhoodsCrime) {
      setNeighborhoodsCrimeByYear(neighborhoodsCrime);
      createPolygonsNeighbordhood(
        neighborhoodsCrime,
        categoryCrime,
        neighbordhoodsCoordinates,
        map,
        setPolygons
      );
    }
  };

  const loadCrimeDataNeighborhoods = async (categoryCrime) => {
    let years = await getYearsNeighborhoodsCrime(categoryCrime);

    if (years) {
      setYearSelected(years[0].year);
      setYears(years);
      loadCrimesByYear(years[0].year, categoryCrime);
    }
  };

  return (
    <ZoneCrimesContext.Provider
      value={{
        getYearsNeighborhoodsCrime,
        setLoadingYears,
        loadingYears,
        setYears,
        years,
        setYearSelected,
        yearSelected,
        getNeighborhoodsCrimeByYear,
        loadingNeighborhoodsCrime,
        neighborhoodsCrimeByYear,
        setNeighborhoodsCrimeByYear,
        loadCrimeDataNeighborhoods,
        loadCrimesByYear,
        defineCrimeRate,
        getCrimeRange,
        createPolygonsNeighbordhood,
        polygons,
        setPolygons,
        setIndexChartActive,
        indexChartActive
      }}
    >
      {children}
    </ZoneCrimesContext.Provider>
  );
};

export const useZoneCrimes = () => useContext(ZoneCrimesContext);
