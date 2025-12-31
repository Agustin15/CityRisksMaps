import styles from "./RouteRangesDanger.module.css";

export const RouteRangesDanger = ({ route }) => {
  const colorReference = (range) => {
    switch (range) {
      case "Baja":
        return "#ffffbfff";
      case "Media baja":
        return "#f1f134ff";
      case "Alta":
        return "#fa7c06ff";
      case "Muy alta":
        return "#f73d1cff";
    }
  };

  return (
    <div className={styles.containRangesDanger}>
      <span>Niveles de tasa de homicidios por donde pasa la ruta:</span>
      <ul className={styles.rangesDanger}>
        {route.routeRangesDanger.map((rangeDanger) => (
          <li>
            <div
              style={{ background: colorReference(rangeDanger.range) }}
              className={styles.reference}
            ></div>
            {rangeDanger.range}:{rangeDanger.percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
};
