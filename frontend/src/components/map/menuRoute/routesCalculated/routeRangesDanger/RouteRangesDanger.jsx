import styles from "./RouteRangesDanger.module.css";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { colorReference, calculateAverage } from "./functions";

export const RouteRangesDanger = ({ route }) => {
  const { crimeSelected } = useZoneCrimes();

  console.log(route.routeRangesDanger);
  return (
    <div className={styles.containRangesDanger}>
      <span>
        {crimeSelected
          ? "Niveles de tasa de homicidios por donde pasa la ruta:"
          : "Niveles de percepcion de seguridad por donde pasa la ruta"}
      </span>

      <ul className={styles.rangesDanger}>
        {route.routeRangesDanger.map((rangeDanger) => (
          <li>
            <div
              style={{
                background: colorReference(rangeDanger.range, crimeSelected)
              }}
              className={styles.reference}
            ></div>
            {rangeDanger.range}:{rangeDanger.percentage}%
          </li>
        ))}
        <li>
          <span>(Promedio de seguridad:{calculateAverage(route.routeRangesDanger)}%)</span>
        </li>
      </ul>
    </div>
  );
};
