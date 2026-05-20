import CanvasJSReact from "@canvasjs/react-charts";
import styles from "./ChartIncreaseOfCrimeInNeighborhood.module.css";
import iconNotData from "../../../../assets/img/notDataAlert.png";
import { useEffect, useState } from "react";
import { loadData } from "../functions.js";
import { loadOptionsLineChart } from "../chartIncreaseCategoryCrime/functions.js";
import { FilterOfCrime } from "../filterOfCrime/FilterOfCrime.jsx";
import { FilterOfNeighborhood } from "../filterOfNeighborhood/FilterOfNeighborhood.jsx";

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
    if (!crimeSelected || !neighborhoodSelected) return;
    loadChangeFilter();
  }, [crimeSelected, neighborhoodSelected]);

  const loadChangeFilter = async () => {
    try {
      setError("");

      const endpoint =
        "/admin/neighborhoodCrime/increaseOfCrimeInNeighborhood/" +
        crimeSelected +
        "/" +
        neighborhoodSelected.idNeighborhood;

      const result = await loadData(endpoint);

      setDataChart(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.header}>

        <div className={styles.row}>
        <FilterOfCrime
          crimes={crimes}
          setCrimes={setCrimes}
          setCrimeSelected={setCrimeSelected}
          setLoading={setLoading}
          setError={setError}
        />
        {crimes && (
          <FilterOfNeighborhood
            neighborhoods={neighborhoods}
            setNeighborhoods={setNeighborhoods}
            setNeighborhoodSelected={setNeighborhoodSelected}
            setLoading={setLoading}
            setError={setError}
          />
        )}
        </div>
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
