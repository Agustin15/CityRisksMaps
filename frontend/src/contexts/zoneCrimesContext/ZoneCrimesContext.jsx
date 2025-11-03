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
  const { neighbordhoodsCoordinates } = useMapControls();
  const [polygons, setPolygons] = useState([]);

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
            nhCrime.quantiyCrime >= 0
              ? defineCrimeRate(nhCrime.quantiyCrime, nhCrime.quantiyPopulation)
              : null;

          const colorRange =
            rate >= 0 ? getCrimeRange(rate, categoryCrime) : null;

          nhCrimeCoordinates.push({
            coordinates: nhCoordinate.coordinates,
            name: nhCrime.name,
            rate: rate,
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
        clickable: true,
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

  return (
    <ZoneCrimesContext.Provider
      value={{
        getNeighborhoodsCrimeByYear,
        getYearsNeighborhoodsCrime,
        loadingNeighborhoodsCrime,
        loadingYears,
        defineCrimeRate,
        getCrimeRange,
        createPolygonsNeighbordhood,
        polygons,
        setPolygons
      }}
    >
      {children}
    </ZoneCrimesContext.Provider>
  );
};

export const useZoneCrimes = () => useContext(ZoneCrimesContext);
