import { useContext, useState } from "react";
import { createContext } from "react";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;
const ZoneCrimesContext = createContext();

export const ZoneCrimesProvider = ({ children }) => {
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingNeighborhoodsCrime, setLoadingNeighborhoodsCrime] =
    useState(false);

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
    return Math.floor(
      (quantiyCrime / quantiyPopulation) * 100000
    ).toLocaleString();
  };

  const defineCrimeRange = (rate, ranges) => {
    const crimeRanges = [
      { rate: rate >= ranges[0] && rate <= ranges[1], color: "#ffffe4ff" },
      { rate: rate >= ranges[2] && rate <= ranges[3], color: "#ffff96ff" },
      { rate: rate >= ranges[4] && rate <= ranges[5], color: "#fa7c06ff" },
      { rate: rate >= ranges[6], color: "#f73d1cff" }
    ];
    const crimeRangeFound = crimeRanges.find((item) => item.rate == true);
    if (crimeRangeFound) {
      return crimeRangeFound.color;
    }
    return "gray";
  };

  return (
    <ZoneCrimesContext.Provider
      value={{
        getNeighborhoodsCrimeByYear,
        getYearsNeighborhoodsCrime,
        loadingNeighborhoodsCrime,
        loadingYears,
        defineCrimeRate,
        defineCrimeRange
      }}
    >
      {children}
    </ZoneCrimesContext.Provider>
  );
};

export const useZoneCrimes = () => useContext(ZoneCrimesContext);
