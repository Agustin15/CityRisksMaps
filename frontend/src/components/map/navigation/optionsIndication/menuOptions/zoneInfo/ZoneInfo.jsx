import styles from "./zoneInfo.module.css";
import { SvgWarning } from "./svgWarning/SvgWarning";
import { useState } from "react";
import { useNavigationStep } from "../../../../../../contexts/navigationContext/NavigationStepContext";

export const ZoneInfo = ({ svgWarningRef }) => {
  const [showDetailsWarning, setShowDetailsWarning] = useState(false);
  const { warning } = useNavigationStep();

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
          <span>Tasa de homicidios {warning.neighborhood + ":"}</span>

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
