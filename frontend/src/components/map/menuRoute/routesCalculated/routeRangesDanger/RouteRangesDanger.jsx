import styles from "./RouteRangesDanger.module.css";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { colorReference } from "./functions";

export const RouteRangesDanger = ({ route }) => {
  const { crimeSelected } = useZoneCrimes();

  return (
    <div className={styles.containRangesDanger}>
      <span>
        {crimeSelected
          ? "Niveles de tasa de homicidios por donde pasa la ruta:"
          : "Niveles de percepcion de seguridad por donde pasa la ruta"}
      </span>

      <ul className={styles.rangesDanger}>
        {route.routeRangesDanger.map((rangeDanger, index) => (
          <li key={index} className={styles.itemRoute}>
            <div
              style={{
                background: colorReference(rangeDanger.range, crimeSelected)
              }}
              className={styles.reference}
            ></div>
            {rangeDanger.range}:{rangeDanger.percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
};
