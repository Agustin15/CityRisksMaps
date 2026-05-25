import styles from "./PolygonDraw.module.css";
import iconRate from "../../../../../../../assets/img/average.png";
import iconComplaint from "../../../../../../../assets/img/complaint.png";
import iconSecurity from "../../../../../../../assets/img/security.png";
import iconPopulation from "../../../../../../../assets/img/population.png";
import { useEffect, useRef, useState } from "react";
import { useMapControls } from "../../../../../../../contexts/MapContext";
import { useNeighborhoodsCrimes } from "../../../../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { drawShape } from "./functions.js";

export const PolygonDraw = ({ neighborhoodCrime, categoryCrime }) => {
  const { neighborhoodsCoordinates } = useMapControls();
  const { getCrimeRange } = useNeighborhoodsCrimes();
  const [drawn, setDrawn] = useState(false);
  const refCanvasPolygon = useRef();

  useEffect(() => {
    if (drawn) return;
    draw();
  }, []);

  const crimeRange = getCrimeRange(neighborhoodCrime.rate, categoryCrime);

  const draw = () => {
    if (refCanvasPolygon.current) {
      const canvas = refCanvasPolygon.current;
      const ctx = canvas.getContext("2d");

      const neighborhoodCoordinates = neighborhoodsCoordinates.find(
        (nhCoord) => {
          return nhCoord.neighborhood == neighborhoodCrime.name;
        }
      );

      const rateColor = crimeRange ? crimeRange.color : "#bbbbbbff";

      drawShape(neighborhoodCoordinates, canvas, ctx, rateColor);
      setDrawn(true);
    }
  };

  return (
    <div className={styles.containPolygon}>
      <ul>
        <li>
          <img src={iconComplaint}></img>
          <label>Denuncias:</label>
          <span>{neighborhoodCrime.quantityCrime}</span>
        </li>
        <li>
          <img src={iconPopulation}></img>
          <label>Poblacion:</label>
          <span>
            {neighborhoodCrime.quantityPopulation.toLocaleString("es-ES")}
          </span>
        </li>
        <li>
          <img src={iconRate}></img>
          <label>Tasa de denuncias:</label>
          <span>{neighborhoodCrime.rate}</span>
        </li>
        <li>
          <img src={iconSecurity}></img>
          <label>Tendencia:</label>
          <span>{crimeRange ? crimeRange.level : "Sin datos"}</span>
        </li>
      </ul>

      <canvas className={styles.canvas} ref={refCanvasPolygon}></canvas>
    </div>
  );
};
