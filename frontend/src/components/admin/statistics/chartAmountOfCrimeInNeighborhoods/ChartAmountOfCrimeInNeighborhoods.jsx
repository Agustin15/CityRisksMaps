import CanvasJSReact from "@canvasjs/react-charts";
import styles from "./ChartAmountOfCrimeInNeighborhoods.module.css";
import iconNotData from "../../../../assets/img/notDataAlert.png";
import { loadOptionsColumnChart } from "./function.js";
import { useState, useEffect } from "react";
import { FilterOfYears } from "../filterOfYears/FilterOfYears";
import { FilterOfCrime } from "../filterOfCrime/FilterOfCrime";
import { loadData } from "../functions";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ChartAmountOfCrimeInNeighborhoodsByYear = () => {
  const [crimes, setCrimes] = useState([]);
  const [crimeSelected, setCrimeSelected] = useState(null);
  const [years, setYears] = useState([]);
  const [yearSelected, setYearSelected] = useState(null);
  const [offset, setOffset] = useState(0);
  const [dataChart, setDataChart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!crimeSelected || !yearSelected) return;
    loadChangeFilter();
  }, [crimeSelected, yearSelected, offset]);

  const loadChangeFilter = async () => {
    setError("");
    try {
      const result = await loadData(
        "/admin/neighborhoodCrime/amountOfAnCrimeInNeighborhoodsByYear/" +
          crimeSelected +
          "/" +
          yearSelected +
          "/" +
          offset
      );

      if (result) setDataChart(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.header}>
        <h3>
          {crimeSelected &&
            yearSelected &&
            "Cantidad de " + crimeSelected + "s en barrios en " + yearSelected}
        </h3>

        <div className={styles.row}>
          <FilterOfCrime
            crimes={crimes}
            setCrimes={setCrimes}
            setCrimeSelected={setCrimeSelected}
            setLoading={setLoading}
            setError={setError}
          />
          <FilterOfYears
            years={years}
            setYears={setYears}
            setYearSelected={setYearSelected}
            setLoading={setLoading}
            setError={setError}
          />
          <select onChange={(event) => setOffset(event.target.value)}>
            <option value={0}>0 a 15</option>
            <option value={16}>16 a 31</option>
            <option value={32}>32 a 47</option>
              <option value={48}>48 a 62</option>
          </select>
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
          options={loadOptionsColumnChart(dataChart, crimeSelected)}
        ></CanvasJSChart>
      )}
    </div>
  );
};
