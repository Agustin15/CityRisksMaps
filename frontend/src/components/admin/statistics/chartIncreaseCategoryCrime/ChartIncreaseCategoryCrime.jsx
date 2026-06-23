import CanvasJSReact from "@canvasjs/react-charts";
import styles from "./ChartIncreaseCategoryCrime.module.css";
import iconNotData from "../../../../assets/img/notDataAlert.png";
import { useEffect, useState } from "react";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { loadData } from "../functions.js";
import { loadOptionsLineChart } from "./functions.js";
import { FilterOfCrime } from "../filterOfCrime/FilterOfCrime.jsx";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ChartIncreaseCategoryCrime = () => {
  const [crimes, setCrimes] = useState([]);
  const [crimeSelected, setCrimeSelected] = useState(null);
  const [dataChart, setDataChart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { windowWidth } = useWindowResize();

  useEffect(() => {
    if (!crimeSelected) return;
    loadChangeFilter();
  }, [crimeSelected]);

  const loadChangeFilter = async () => {
    setError("");
    try {
      const result = await loadData(
        "/admin/neighborhoodCrime/increaseOfCrimeInYears/" + crimeSelected
      );

      setDataChart(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.header}>
        {crimeSelected && (
          <h3>Crecimiento de denuncias de {crimeSelected + "s"}</h3>
        )}
        <div className={styles.row}>
          <FilterOfCrime
            crimes={crimes}
            setCrimes={setCrimes}
            setCrimeSelected={setCrimeSelected}
            setLoading={setLoading}
            setError={setError}
          />
        </div>
      </div>

      {loading && (
        <div className={styles.containLoader}>
          <span className={styles.loader}></span>
          <h3>Cargando datos</h3>
        </div>
      )}
      {!loading && error.length > 0 && (
        <div className={styles.containError}>
          <h3>{error}</h3>
          <img src={iconNotData}></img>
        </div>
      )}
      {!loading && error.length == 0 && dataChart && (
        <CanvasJSChart
          options={loadOptionsLineChart(
            dataChart,
            crimeSelected,
            10,
            4000,
            windowWidth
          )}
        ></CanvasJSChart>
      )}
    </div>
  );
};
