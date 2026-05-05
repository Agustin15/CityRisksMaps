import styles from "./ChartIncreaseCategoryCrime.module.css";
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { loadData, loadOptionsChart } from "../functions.js";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ChartIncreaseCategoryCrime = () => {
  const [crimes, setCrimes] = useState([]);
  const [crimeSelected, setCrimeSelected] = useState(null);
  const [dataChart, setDataChart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilter();
  }, []);

  useEffect(() => {
    if (!crimeSelected) return;
    loadChangeFilter();
  }, [crimeSelected]);

  const loadChangeFilter = async () => {
    setLoading(true);
    try {
      const result = await loadData(
        LOCALHOST_BACKEND +
          "/neighborhoodCrimeAdmin/amountOfAnCrimeInYears/" +
          crimeSelected
      );

      setDataChart(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFilter = async () => {
    setLoading(true);
    try {
      const crimes = await loadData(LOCALHOST_BACKEND + "/crime/crimes");
      setCrimes(crimes);
      setCrimeSelected(crimes[0].category);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.header}>
        <h3>Crecimiento de Homicidios en los años</h3>
        <div className={styles.containSelect}>
          <select onChange={(event) => setCrimeSelected(event.target.value)}>
            {crimes.length > 0 &&
              crimes.map((crime, index) => (
                <option value={crime.category} key={index}>
                  {crime.category}
                </option>
              ))}
          </select>
        </div>
      </div>

      {dataChart && (
        <CanvasJSChart
          options={loadOptionsChart(dataChart, crimeSelected)}
        ></CanvasJSChart>
      )}
    </div>
  );
};
