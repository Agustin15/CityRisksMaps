import styles from "./zoneInfo.module.css";

export const ZoneInfo = ({ warning }) => {
  return (
    <div className={styles.zoneInfo}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <polygon
          points="50,5 95,75 5,75"
          fill={warning.rateColor}
          stroke="#000"
          strokeWidth={5}
        ></polygon>

        <rect x="47" y="23" width="6" height="35" fill="#000"></rect>
        <circle cx="50" cy="64" r="4" fill="#000"></circle>
      </svg>

      {warning.type.length > 0 && (
        <p>
          {warning.type == "crime"
            ? "Tasa de homicidios " + warning.neighborhood + ":"
            : "Percepcion de seguridad" + warning.neighborhood + ":"}
        </p>
      )}

      <p>
        {warning.rateLevel.length > 0 ? warning.rateLevel : "barrio sin datos"}
      </p>
    </div>
  );
};
