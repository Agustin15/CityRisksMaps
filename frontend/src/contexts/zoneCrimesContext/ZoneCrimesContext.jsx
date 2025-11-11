import { useContext, useState } from "react";
import { createContext } from "react";
import { useMapControls } from "../MapContext";
import { useMap } from "@vis.gl/react-google-maps";
import { getDrawInfoWindow } from "./infoWindow.js";
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
      console.log(error);
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

  const defineCrimeRate = (quantiyCrime, quantiyPopulation) => {
    return Math.floor((quantiyCrime / quantiyPopulation) * 100000);
  };

  const defineCrimeRange = (rate, ranges) => {
    const crimeRanges = [
      { rate: rate >= ranges[0] && rate <= ranges[1], color: "#ffffbfff" },
      { rate: rate >= ranges[2] && rate <= ranges[3], color: "#f1f134ff" },
      { rate: rate >= ranges[4] && rate <= ranges[5], color: "#fa7c06ff" },
      { rate: rate >= ranges[6], color: "#f73d1cff" }
    ];
    const crimeRangeFound = crimeRanges.find((item) => item.rate == true);
    if (crimeRangeFound) {
      return crimeRangeFound.color;
    }
  };

  const getCrimeRange = (rate, categoryCrime) => {
    switch (categoryCrime) {
      case "Asesinato":
        return defineCrimeRange(rate, [0, 10, 11, 22, 23, 30, 31]);

      case "Hurto":
        return defineCrimeRange(rate, [0, 900, 901, 1800, 1801, 2890, 2891]);

      case "Rapiña":
        return defineCrimeRange(rate, [0, 400, 401, 900, 901, 1200, 1201]);
    }
  };

  const createArrayForPolygons = (neighbordhoodsCrime, categoryCrime) => {
    const nhCrimeCoordinates = [];
    for (let nhCrime of neighbordhoodsCrime) {
      neighbordhoodsCoordinates.map((nhCoordinate) => {
        if (
          nhCoordinate.neighborhood.toLowerCase() == nhCrime.name.toLowerCase()
        ) {
          const rate =
            nhCrime.quantiyCrime == null
              ? null
              : defineCrimeRate(
                  nhCrime.quantiyCrime,
                  nhCrime.quantiyPopulation
                );

          const colorRange =
            rate == null ? null : getCrimeRange(rate, categoryCrime);

          nhCrimeCoordinates.push({
            coordinates: nhCoordinate.coordinates,
            name: nhCrime.name,
            quantityCrime: nhCrime.quantiyCrime,
            rateColor: colorRange ? colorRange : "#bbbbbbff"
          });
        }
      });
    }
    return nhCrimeCoordinates;
  };

  const createPolygonsNeighbordhood = async (
    neighbordhoodsCrime,
    categoryCrime
  ) => {
    
    const polygons = [];
    map.setZoom(12);

    const nhCrimeCoordinates = createArrayForPolygons(
      neighbordhoodsCrime,
      categoryCrime
    );

    nhCrimeCoordinates.forEach((nhCrimeCoordinate) => {
      const polygon = new google.maps.Polygon({
        paths: nhCrimeCoordinate.coordinates,
        strokeColor: "#8d8d8dff",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: nhCrimeCoordinate.rateColor,
        fillOpacity: 0.4,
        clickable: false,
        data: nhCrimeCoordinate
      });
      polygon.setMap(map);

      const infoWindow = new google.maps.InfoWindow();
      polygon.addListener("mouseover", function (event) {
        infoWindow.setContent(getDrawInfoWindow(this.data, categoryCrime));
        infoWindow.setPosition(event.latLng);

        infoWindow.open(map);
      });

      polygon.addListener("mouseout", function (event) {
        infoWindow.close();
      });
      polygons.push(polygon);
    });

    setPolygons(polygons);
  };

  const loadCrimesByYear = async (year, categoryCrime) => {
    polygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setPolygons([]);

    setYearSelected(year);
    let neighborhoodsCrime = await getNeighborhoodsCrimeByYear(
      year,
      categoryCrime
    );

    if (neighborhoodsCrime) {
      setNeighborhoodsCrimeByYear(neighborhoodsCrime);
      createPolygonsNeighbordhood(neighborhoodsCrime, categoryCrime);
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
        loadingYears,
        years,
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
