import styles from "./ChartIncreaseOfCrimeInNeighborhood.module.css";
import iconNotData from "../../../../assets/img/notDataAlert.png";
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { loadData } from "../functions.js";
import { FilterChart } from "./filterChart/FilterChart.jsx";
import { loadOptionsLineChart } from "../chartIncreaseCategoryCrime/functions.js";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ChartIncreaseOfCrimeInNeighborhood = () => {
  const [crimes, setCrimes] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [crimeSelected, setCrimeSelected] = useState(null);
  const [neighborhoodSelected, setNeighborhoodSelected] = useState(null);
  const [dataChart, setDataChart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilter();
  }, []);

  useEffect(() => {
    if (!crimeSelected || !neighborhoodSelected) return;
    loadChangeFilter();
  }, [crimeSelected, neighborhoodSelected]);

  const loadChangeFilter = async () => {
    try {
      setError("");

      const endpoint =
        "/neighborhoodCrimeAdmin/increaseOfCrimeInNeighborhood/" +
        crimeSelected +
        "/" +
        neighborhoodSelected.idNeighborhood;

      const result = await loadData(endpoint);

      setDataChart(result);
    } catch (error) {
      setError(error.message);
    }
  };

  const loadFilter = async () => {
    setLoading(true);
    try {
      const crimes = await loadData("/crime/crimes");
      setCrimes(crimes);
      setCrimeSelected(crimes[0].category);
      const neighborhoods = await loadData("/neighborhood/allNeighborhoods");
      setNeighborhoods(neighborhoods);
      setNeighborhoodSelected(neighborhoods[0]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.header}>
        <FilterChart
          crimes={crimes}
          neighborhoods={neighborhoods}
          setCrimeSelected={setCrimeSelected}
          setNeighborhoodSelected={setNeighborhoodSelected}
        />
        {crimeSelected && neighborhoodSelected && (
          <h3>
            Crecimiento de denuncias de {crimeSelected + "s"} en{" "}
            {neighborhoodSelected.name}{" "}
          </h3>
        )}
      </div>

      {loading && (
        <div className={styles.containLoader}>
          <span className={styles.loader}></span>
          <h3>Cargando datos</h3>
        </div>
      )}
      {!loading && error.length > 0 && (
        <div className={styles.containError}>
          <img src={iconNotData}></img>
          <h3>{error}</h3>
        </div>
      )}
      {!loading && error.length == 0 && dataChart && (
        <CanvasJSChart
          options={loadOptionsLineChart(dataChart, crimeSelected, 2, 200)}
        ></CanvasJSChart>
      )}
    </div>
  );
};
