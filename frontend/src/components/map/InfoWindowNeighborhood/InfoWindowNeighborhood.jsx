import styles from "./InfoWindowNeighborhood.module.css";
import { useRef } from "react";

export const InfoWindowNeighborhood = ({ polygonSelected }) => {
  const window = useRef();

  return (
    <div ref={window} className={styles.infoWindowPolygon}>
      <div className={styles.row}>
        <span>
          {polygonSelected.data.name +
            " (Tasa de " +
            polygonSelected.data.categoryCrime +
            "s: "}
          {polygonSelected.data.rateLevel + ")"}
        </span>

        <div style={{ background: polygonSelected.data.rateColor }}></div>
      </div>

      <p>
        Poblacion:{polygonSelected.data.population.toLocaleString()} habitantes
      </p>

      <p>
        Denuncias de
        {" " +
          polygonSelected.data.categoryCrime +
          "s:" +
          +(polygonSelected.data.quantityCrime == null
            ? "Sin Datos"
            : polygonSelected.data.quantityCrime)}
      </p>
      <p>
        Tasa de denuncias cada 100.000 habitantes:
        {polygonSelected.data.rate}
      </p>
    </div>
  );
};
