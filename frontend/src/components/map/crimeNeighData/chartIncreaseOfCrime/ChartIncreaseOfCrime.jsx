import CanvasJSReact from "@canvasjs/react-charts";
import styles from "./ChartIncreaseOfCrime.module.css";
import iconNotData from "../../../../assets/img/notDataAlert.png";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useEffect, useState } from "react";
import { getIncreaseOfCrime, loadOptionsColumnChart } from "./functions.js";

const CanvasChart = CanvasJSReact.CanvasJSChart;

export const ChartIncreaseOfCrime = ({ setShowChart }) => {
  const { crimeSelected, years } = useNeighborhoodsCrimes();
  const { windowWidth } = useWindowResize();
  const [dataChart, setDataChart] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      loadDataChart();
    }, 500);
  }, []);

  const loadDataChart = async () => {
    const result = await getIncreaseOfCrime(
      setError,
      setLoading,
      crimeSelected
    );

    if (result) setDataChart(result);
  };

  return (
    <div className={styles.modalChart}>
      <div className={styles.containChart}>
        <div className={styles.header}>
          <h3>
            {crimeSelected}s{" "}
            {dataChart
              ? dataChart[0].year + " - " + dataChart[dataChart.length - 1].year
              : "..."}
          </h3>
          <button className={styles.close} onClick={() => setShowChart(false)}>
            Cerrar
          </button>
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

        {dataChart && (
          <CanvasChart
            options={loadOptionsColumnChart(
              dataChart,
              crimeSelected,
              windowWidth
            )}
          ></CanvasChart>
        )}
      </div>
    </div>
  );
};
