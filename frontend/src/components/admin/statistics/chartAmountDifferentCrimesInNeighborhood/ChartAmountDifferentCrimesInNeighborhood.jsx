import CanvasJSReact from "@canvasjs/react-charts";
import styles from "./ChartAmountDifferentCrimesInNeighborhood.module.css";
import iconNotData from "../../../../assets/img/notDataAlert.png";
import { useEffect, useState } from "react";
import { loadData } from "../functions.js";
import { loadOptionsColumnChart } from "./function.js";
import { FilterOfNeighborhood } from "../filterOfNeighborhood/FilterOfNeighborhood.jsx";
import { FilterOfYears } from "../filterOfYears/FilterOfYears.jsx";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ChartAmountDifferentCrimesInNeighborhood = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [neighborhoodSelected, setNeighborhoodSelected] = useState(null);
  const [years, setYears] = useState([]);
  const [yearSelected, setYearSelected] = useState(null);
  const [dataChart, setDataChart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!neighborhoodSelected || !yearSelected) return;
    loadChangeFilter();
  }, [neighborhoodSelected, yearSelected]);

  const loadChangeFilter = async () => {
    setError("");
    try {
      const result = await loadData(
        "/neighborhoodCrimeAdmin/amountOfDifferentsCrimesInNeighborhoodInYear/" +
          neighborhoodSelected.idNeighborhood +
          "/" +
          yearSelected
      );

      setDataChart(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.header}>
        <h3>
          {neighborhoodSelected &&
            yearSelected &&
            "Cantidad de denuncias por delitos en " +
              neighborhoodSelected.name +
              " en " +
              yearSelected}
        </h3>

        <div className={styles.row}>
          <FilterOfNeighborhood
            neighborhoods={neighborhoods}
            setNeighborhoods={setNeighborhoods}
            setNeighborhoodSelected={setNeighborhoodSelected}
            setLoading={setLoading}
            setError={setError}
          />

          {neighborhoods && (
            <FilterOfYears
              years={years}
              setYears={setYears}
              setYearSelected={setYearSelected}
              setLoading={setLoading}
              setError={setError}
            />
          )}
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
          options={loadOptionsColumnChart(dataChart)}
        ></CanvasJSChart>
      )}
    </div>
  );
};
