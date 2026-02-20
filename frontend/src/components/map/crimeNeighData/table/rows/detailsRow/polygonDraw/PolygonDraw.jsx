import styles from "./PolygonDraw.module.css";
import iconRate from "../../../../../../../assets/img/average.png";
import iconComplaint from "../../../../../../../assets/img/complaint.png";
import iconSecurity from "../../../../../../../assets/img/security.png";
import iconPopulation from "../../../../../../../assets/img/population.png";
import { useEffect, useRef, useState } from "react";
import { useMapControls } from "../../../../../../../contexts/MapContext";
import { useZoneCrimes } from "../../../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { drawShape } from "./functions.js";

export const PolygonDraw = ({ neighborhoodCrime, categoryCrime }) => {
  const { neighbordhoodsCoordinates } = useMapControls();
  const { getCrimeRange } = useZoneCrimes();
  const [drawn, setDrawn] = useState(false);
  const refCanvasPolygon = useRef();

  useEffect(() => {
    if (drawn) return;
    draw();
  }, []);

  const rate =
    neighborhoodCrime.quantityCrime == null
      ? null
      : Math.floor(
          (neighborhoodCrime.quantityCrime /
            neighborhoodCrime.quantityPopulation) *
            100000
        );

  const crimeRange = rate == null ? null : getCrimeRange(rate, categoryCrime);

  const draw = () => {
    if (refCanvasPolygon.current) {
      const canvas = refCanvasPolygon.current;
      const ctx = canvas.getContext("2d");

      const neighborhoodCoordinates = neighbordhoodsCoordinates.find(
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
          <span>{neighborhoodCrime.quantityPopulation}</span>
        </li>
        <li>
          <img src={iconRate}></img>
          <label>Tasa de denuncias:</label>
          <span>{rate}</span>
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
