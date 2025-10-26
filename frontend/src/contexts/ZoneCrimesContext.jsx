import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;
const ZoneCrimesContext = createContext();

export const ZoneCrimesProvider = ({ children }) => {
  const [neighborhoodsCrimeByYear, setNeighborhoodsCrimeByYear] = useState();

  const fetchEndpoint = async (optionGET) => {
    try {
      const response = await fetch(
        localhostBackend + "/neighborhoodCrime/" + optionGET,
        {
          method: "GET",
          headers: { "Content-type": "application/json" }
        }
      );

      const result = await response.json();
      console.log(result);
      if (result) setNeighborhoodsCrimeByYear(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getNeighborhoodsCrimeByYear = async (year, categoryCrime) => {
    let optionGET = JSON.stringify({
      option: "getNeighborhoodsCrimeByYear",
      year: year,
      categoryCrime: categoryCrime
    });

    fetchEndpoint(optionGET);
  };

  const getYearsNeighborhoodsCrime = async (categoryCrime) => {
    let optionGET = JSON.stringify({
      option: "getYearsNeighborhoodsCrime",
      categoryCrime: categoryCrime
    });

    fetchEndpoint(optionGET);
  };

  return (
    <ZoneCrimesContext.Provider
      value={{ getNeighborhoodsCrimeByYear, neighborhoodsCrimeByYear }}
    >
      {children}
    </ZoneCrimesContext.Provider>
  );
};

export const useZoneCrimes = () => useContext(ZoneCrimesContext);
