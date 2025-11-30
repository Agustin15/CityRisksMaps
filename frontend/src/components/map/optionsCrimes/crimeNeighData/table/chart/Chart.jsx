import styles from "./Chart.module.css";
import iconNoData from "../../../../../../assets/img/notData.png";
import { useState } from "react";
import { useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const Chart = ({ categoryCrime, nameNeighborhood }) => {
  const [dataChart, setDataChart] = useState();
  const [loading, setLoading] = useState(false);
 
  const options = {
    title: {
      text: `Denuncias de ${categoryCrime}s en ${nameNeighborhood}`,
      fontSize: 14,
      fontFamily: "arial",
      fontWeight: "bold"
    },
    height: 225,
    animationEnabled: true,
    axisX: {
      interval: 1
    },
    data: [
      {
        markerColor: "#e04b4bff",
        type: "spline",
        dataPoints:
          dataChart &&
          dataChart.map((neighborhoodCrime) => {
            return { x: neighborhoodCrime.year, y: neighborhoodCrime.quantity };
          })
      }
    ]
  };

  useEffect(() => {
    loadDataChart();
  }, []);

  const loadDataChart = async () => {
    let optionGET = JSON.stringify({
      option: "getCategoryCrimeInNeighborhood",
      neighborhood: nameNeighborhood,
      categoryCrime: categoryCrime
    });

    setLoading(true);
    try {
      const response = await fetch(
        localhostBackend + "/neighborhoodCrime/" + optionGET,
        {
          method: "GET",
          headers: { "Content-type": "application/json" }
        }
      );

      const result = await response.json();

      if (result.length > 0) setDataChart(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containChart}>
      {loading && <span>Cargando datos...</span>}
      {!loading && dataChart && (
        <CanvasJSChart options={options}></CanvasJSChart>
      )}
      {!loading && !dataChart && (
        <div className={styles.noData}>
          <img src={iconNoData}></img>
          <span> Sin registros para graficar</span>
        </div>
      )}
    </div>
  );
};
