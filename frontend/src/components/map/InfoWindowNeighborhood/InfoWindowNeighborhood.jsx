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
        <span>Barrio: {polygonSelected.data.name}</span>

        <div style={{ background: polygonSelected.data.rateColor }}></div>
      </div>

      <p>
        <a>
          Tasa de {polygonSelected.data.categoryCrime}s
          {" " + polygonSelected.data.yearCrime}
          {yearNotFinished(polygonSelected.data.yearCrime)
            ? " (en curso): "
            : ": "}
        </a>
        {polygonSelected.data.rateLevel}
      </p>
      <p>
        <a>Poblacion:</a>
        {polygonSelected.data.population.toLocaleString()} habitantes
      </p>

      <p>
        <a>{`Denuncias de 
          ${polygonSelected.data.categoryCrime}s:`}</a>
        {polygonSelected.data.quantityCrime == null
          ? "Sin Datos"
          : polygonSelected.data.quantityCrime}
      </p>
      <p>
        <a> Tasa de denuncias cada 100.000 habitantes:</a>
        {polygonSelected.data.rate}
      </p>
    </div>
  );
};
