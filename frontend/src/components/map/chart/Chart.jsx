import styles from "./Chart.module.css";
import iconNoData from "../../../assets/img/notData.png";
import { useState } from "react";
import { useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { loadDataChart, setOptionsChart } from "./functions";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const Chart = ({ categoryCrime, nameNeighborhood }) => {
  const [dataChart, setDataChart] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataChart) return;
    loadDataChart(categoryCrime, nameNeighborhood, setLoading, setDataChart);
  }, []);

  return (
    <div className={styles.containChart}>
      {loading && <span className={styles.loading}>Cargando datos...</span>}
      {!loading && dataChart && (
        <CanvasJSChart
          options={setOptionsChart(dataChart, categoryCrime, nameNeighborhood)}
        ></CanvasJSChart>
      )}
      {!loading && !dataChart && (
        <div className={styles.noData}>
          <img src={iconNoData}></img>
          <span>Sin registros para graficar</span>
        </div>
      )}
    </div>
  );
};
