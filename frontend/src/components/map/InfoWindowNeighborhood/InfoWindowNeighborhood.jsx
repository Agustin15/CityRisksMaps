import { useInteractionNeighborhoodsPolygons } from "../../../contexts/neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext";
import styles from "./InfoWindowNeighborhood.module.css";
import { useRef } from "react";

export const InfoWindowNeighborhood = () => {
  const window = useRef();
  const { polygonSelected } = useInteractionNeighborhoodsPolygons();

  const yearNotFinished = (year) => new Date().getFullYear() == year;

  return (
    <div ref={window} className={styles.infoWindowPolygon}>
      <div className={styles.row}>
        <span>
          {`${polygonSelected.data.name}
            (Tasa de
            ${polygonSelected.data.categoryCrime}s ${polygonSelected.data.yearCrime}
             ${yearNotFinished(polygonSelected.data.yearCrime) ? " (en curso):" : ":"}
             ${polygonSelected.data.rateLevel})
            `}
        </span>

        <div style={{ background: polygonSelected.data.rateColor }}></div>
      </div>

      <p>
        Poblacion:{polygonSelected.data.population.toLocaleString()} habitantes
      </p>

      <p>
        {`Denuncias de 
          ${polygonSelected.data.categoryCrime}s: 
          ${
            polygonSelected.data.quantityCrime == null
              ? "Sin Datos"
              : polygonSelected.data.quantityCrime
          }`}
      </p>
      <p>
        Tasa de denuncias cada 100.000 habitantes:
        {polygonSelected.data.rate}
      </p>
    </div>
  );
};
