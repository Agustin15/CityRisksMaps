import styles from "./Chart.module.css";
import iconNoData from "../../../../../../assets/img/notData.png";
import { loadOptions, getDataChart } from "./functions.js";
import CanvasJSReact from "@canvasjs/react-charts";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext.jsx";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const Chart = ({ idNeighborhood, setChartPopulation }) => {
  const [errorChart, setErrorChart] = useState();
  const [loading, setLoading] = useState(true);
  const [dataChart, setDataChart] = useState();
  const { setUser } = useAuth();

  useEffect(() => {
    loadDataChart();
  }, []);

  const loadDataChart = async () => {
    const result = await getDataChart(idNeighborhood, setErrorChart, setUser);
    setDataChart(result);
    setLoading(false);
  };

  return (
    <div className={styles.containChart}>
      <h3>Crecimiento poblacional</h3>

      <button onClick={() => setChartPopulation(null)} className={styles.close}>
        X
      </button>

      <div className={styles.chart}>
        {loading == true && <p>Cargando datos...</p>}
        {loading == false && !dataChart && (
          <div className={styles.noData}>
            <img src={iconNoData}></img>
            <p>{errorChart}</p>
          </div>
        )}
        {loading == false && dataChart && (
          <CanvasJSChart options={loadOptions(dataChart)}></CanvasJSChart>
        )}

        <div className={styles.reflex}></div>
        <div className={styles.reflexTwo}></div>
        <div className={styles.reflexThree}></div>
      </div>
    </div>
  );
};
