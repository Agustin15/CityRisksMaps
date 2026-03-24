import styles from "./Chart.module.css";
import iconNoData from "../../../assets/img/notData.png";
import { useState } from "react";
import { useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { setOptionsChart, getDataChart } from "./functions";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const Chart = ({ categoryCrime, neighborhoodCrime }) => {
  const [dataChart, setDataChart] = useState();
  const [loading, setLoading] = useState(false);
  const [errorDataChart, setErrorDataChart] = useState();

  useEffect(() => {
    if (dataChart) return;
    loadDataChart();
  }, []);

  const loadDataChart = async () => {
    setLoading(true);
    const result = await getDataChart(
      categoryCrime,
      neighborhoodCrime.idNeighborhood,
      setErrorDataChart
    );
    if (result) setDataChart(result);

    setLoading(false);
  };
  return (
    <div className={styles.containChart}>
      {loading && <span className={styles.loading}>Cargando datos...</span>}
      {!loading && dataChart && (
        <CanvasJSChart
          options={setOptionsChart(
            dataChart,
            categoryCrime,
            neighborhoodCrime.name
          )}
        ></CanvasJSChart>
      )}
      {!loading && !dataChart && (
        <div className={styles.noData}>
          <img src={iconNoData}></img>
          <span>{errorDataChart}</span>
        </div>
      )}
    </div>
  );
};
