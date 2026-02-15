import styles from "./ViewStatistics.module.css";
import { useState, useEffect, useId, Activity } from "react";
import { useMapControls } from "../../../../contexts/MapContext";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext.jsx";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { Menu } from "./menu/Menu.jsx";
import { ContainQuizes } from "../../quizes/containQuizes/ContainQuizes.jsx";
import { CrimeNeighbordhoods } from "../../crimeNeighData/CrimeNeighbordhoods.jsx";
import { resize } from "./functions.js";

export const ViewStatistics = () => {
  const [showViewStatistics, setShowViewStatistics] = useState(
    window.innerWidth < 1200 ? false : true
  );
  const viewStatisticsId = useId();
  const { windowWidth } = useWindowResize();
  const { crimeSelected } = useZoneCrimes();
  const { neighbordhoodsCoordinates } = useMapControls();
  const { showQuizes } = useQuizes();

  useEffect(() => {
    if (document.getElementById(viewStatisticsId)) {
      document
        .getElementById(viewStatisticsId)
        .getAnimations()
        .map((animation) => animation.cancel());
    }
    if (windowWidth < 1200 || showViewStatistics == true) return;
    else setShowViewStatistics(true);
  }, [windowWidth]);

  return (
    <>
      <Menu
        neighbordhoodsCoordinates={neighbordhoodsCoordinates}
        showViewStatistics={showViewStatistics}
        setShowViewStatistics={setShowViewStatistics}
      />

      <Activity mode={showViewStatistics == true ? "visible" : "hidden"}>
        <div id={viewStatisticsId} className={styles.viewStatistics}>
          {crimeSelected && (
            <div className={styles.containOptionsCrimes}>
              <div
                onClick={(event) => resize(event)}
                className={styles.deploy}
              ></div>
              <CrimeNeighbordhoods
                categoryCrime={crimeSelected}
                setShowViewStatistics={setShowViewStatistics}
              />
            </div>
          )}

          {showQuizes && (
            <ContainQuizes
              showViewStatistics={showViewStatistics}
              setShowViewStatistics={setShowViewStatistics}
            />
          )}
        </div>
      </Activity>
    </>
  );
};
