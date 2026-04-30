import styles from "./ViewStatistics.module.css";
import { useState, useEffect, useId, Activity } from "react";
import { useMapControls } from "../../../../contexts/MapContext";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { Menu } from "./menu/Menu.jsx";
import { CrimeNeighbordhoods } from "../../crimeNeighData/CrimeNeighbordhoods.jsx";

export const ViewStatistics = () => {
  const [showViewStatistics, setShowViewStatistics] = useState(
    window.innerWidth < 1200 ? false : true
  );

  const viewStatisticsId = useId();
  const { windowWidth } = useWindowResize();
  const { crimeSelected } = useNeighborhoodsCrimes();
  const { neighborhoodsCoordinates } = useMapControls();

  useEffect(() => {
    if (windowWidth < 1200 || showViewStatistics == true) return;
    else setShowViewStatistics(true);
  }, [windowWidth]);

  return (
    <>
      <Menu
        neighborhoodsCoordinates={neighborhoodsCoordinates}
        showViewStatistics={showViewStatistics}
        setShowViewStatistics={setShowViewStatistics}
      />

      <Activity mode={showViewStatistics == true ? "visible" : "hidden"}>
        <div id={viewStatisticsId} className={styles.viewStatistics}>
          <div className={styles.containCheckDeploy}>
            <label htmlFor="checkDeploy"></label>
            <input type="checkbox" id="checkDeploy" className={styles.deploy} />
          </div>

          {crimeSelected && (
            <div className={styles.containOptionsCrimes}>
              <CrimeNeighbordhoods
                categoryCrime={crimeSelected}
                setShowViewStatistics={setShowViewStatistics}
              />
            </div>
          )}
        </div>
      </Activity>
    </>
  );
};
