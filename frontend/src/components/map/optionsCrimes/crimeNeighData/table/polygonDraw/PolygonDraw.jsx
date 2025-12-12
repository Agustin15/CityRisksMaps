import styles from "./PolygonDraw.module.css";
import iconRate from "../../../../../../assets/img/average.png";
import iconComplaint from "../../../../../../assets/img/complaint.png";
import iconSecurity from "../../../../../../assets/img/security.png";
import iconPopulation from "../../../../../../assets/img/population.png";
import { useEffect, useRef } from "react";
import { useMapControls } from "../../../../../../contexts/MapContext";
import { useZoneCrimes } from "../../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";

export const PolygonDraw = ({ neighborhoodCrime, categoryCrime }) => {
  const { neighbordhoodsCoordinates } = useMapControls();
  const { getCrimeRange } = useZoneCrimes();
  const refCanvasPolygon = useRef();

  useEffect(() => {
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

      ctx.beginPath();
      ctx.fillStyle = rateColor;

      ctx.moveTo(20, 20);

      const lats = neighborhoodCoordinates.coordinates.map(
        (nhCoord) => nhCoord.lat
      );

      const lngs = neighborhoodCoordinates.coordinates.map(
        (nhCoord) => nhCoord.lng
      );

      const latMax = Math.max(...lats);
      const latMin = Math.min(...lats);
      const lngMax = Math.max(...lngs);
      const lngMin = Math.min(...lngs);

      //escala para que entre el polygono en canva

      const scaleX = canvas.width / (lngMax - lngMin);
      const scaleY = canvas.height / (latMax - latMin);

      neighborhoodCoordinates.coordinates.forEach((coord, index) => {
        //convertir lat y lng a x,y en pixels
        const x = (coord.lng - lngMin) * scaleX;
        const y = canvas.height - (coord.lat - latMin) * scaleY;

        if (index == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      ctx.stroke();
      ctx.fill();
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
          <label>Tendencia a {categoryCrime.toLowerCase()}s:</label>
          <span>{crimeRange ? crimeRange.level : "Sin datos"}</span>
        </li>
      </ul>
      <canvas className={styles.canvas} ref={refCanvasPolygon}></canvas>
    </div>
  );
};
