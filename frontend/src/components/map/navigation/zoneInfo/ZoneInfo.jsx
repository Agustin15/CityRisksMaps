import styles from "./zoneInfo.module.css";
import { SvgWarning } from "./svgWarning/SvgWarning";
import { useState } from "react";
import { useNavigation } from "../../../../contexts/navigationContext/NavigationContext";

export const ZoneInfo = ({ svgWarningRef }) => {
  const [showDetailsWarning, setShowDetailsWarning] = useState(false);
  const { warning } = useNavigation();

  const handleClick = () => {
    if (showDetailsWarning) setShowDetailsWarning(false);
    else setShowDetailsWarning(true);
  };

  return (
    <div className={styles.zoneInfo}>
      <SvgWarning
        warning={warning}
        handleClick={handleClick}
        svgWarningRef={svgWarningRef}
      />

      {showDetailsWarning && (
        <div className={styles.detailsWarning}>
          {warning.type.length > 0 && (
            <span>
              {warning.type == "crime"
                ? "Tasa de homicidios " + warning.neighborhood + ":"
                : "Percepcion de seguridad" + warning.neighborhood + ":"}
            </span>
          )}

          <p>
            {warning.rateLevel.length > 0
              ? warning.rateLevel
              : "barrio sin datos"}
          </p>
        </div>
      )}
    </div>
  );
};
