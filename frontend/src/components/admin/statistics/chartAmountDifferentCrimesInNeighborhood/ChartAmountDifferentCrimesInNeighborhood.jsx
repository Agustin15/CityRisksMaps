import styles from "./ChartAmountDifferentCrimesInNeighborhood.module.css";
import iconNotData from "../../../../assets/img/notDataAlert.png";
import { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { loadData } from "../functions.js";
import { FilterChart } from "./filterChart/FilterChart.jsx";
import { loadOptionsColumnChart } from "./function.js";

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
    loadFilter();
  }, []);

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

  const loadFilter = async () => {
    setLoading(true);
    try {
      const neighborhoods = await loadData("/neighborhood/allNeighborhoods");
      setNeighborhoods(neighborhoods);
      setNeighborhoodSelected(neighborhoods[0]);
      const years = await loadData("/neighborhoodCrimeAdmin/allYears");
      setYears(years);
      setYearSelected(Object.values(years[0]));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.header}>
        <h3>
          {neighborhoodSelected &&
            yearSelected &&
            "Cantidade de denuncias por delitos en " +
              neighborhoodSelected.name +
              " en " +
              yearSelected}
        </h3>

        <FilterChart
          years={years}
          neighborhoods={neighborhoods}
          setYearSelected={setYearSelected}
          setNeighborhoodSelected={setNeighborhoodSelected}
        />
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
