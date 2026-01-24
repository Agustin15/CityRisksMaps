import styles from "./ViewStatistics.module.css";
import { useMapControls } from "../../../../contexts/MapContext";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext.jsx";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { useState, useEffect} from "react";
import { Menu } from "./menu/Menu.jsx";
import { Loading } from "../../quizes/formAdd/loading/Loading.jsx";
import { NotData } from "../../notData/NotData.jsx";
import { ContainQuizes } from "../../quizes/containQuizes/ContainQuizes.jsx";
import { CrimeNeighbordhoods } from "../../crimeNeighData/CrimeNeighbordhoods.jsx";
import { getCrimes, resize } from "./functions.js";

export const ViewStatistics = () => {
  const [crimes, setCrimes] = useState();
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [errorQuery, setErrorQuery] = useState();
  const [showViewStatistics, setShowViewStatistics] = useState(true);
  const { windowWidth, windowHeight } = useWindowResize();

  const { crimeSelected, setCrimeSelected, loadCrimeDataNeighborhoods } =
    useZoneCrimes();
  const { neighbordhoodsCoordinates } = useMapControls();
  const { showQuizes } = useQuizes();

  useEffect(() => {
    if (!neighbordhoodsCoordinates) return;
    loadData();
  }, [neighbordhoodsCoordinates]);

  useEffect(() => {
    if (windowWidth < 1200 || showViewStatistics == true) return;
    else setShowViewStatistics(true);
  }, [windowWidth, windowHeight]);

  const loadData = async () => {
    const crimes = await getCrimes(setLoadingCrimes, setErrorQuery);
    if (crimes) {
      setCrimes(crimes);
      if (windowWidth >= 1200) {
        setCrimeSelected(crimes[0].category);
        loadCrimeDataNeighborhoods(crimes[0].category);
      }
    }
  };

  windowWidth && windowHeight && resize(windowWidth, windowHeight);

  return (
    <>
      {loadingCrimes == false && crimes && (
        <Menu
          crimes={crimes}
          showViewStatistics={showViewStatistics}
          setShowViewStatistics={setShowViewStatistics}
        />
      )}
      {showViewStatistics && (
        <div id="viewStatistics" className={styles.viewStatistics}>
          {crimeSelected && (
            <div
              onClick={(event) => resize(event)}
              className={styles.containOptionsCrimes}
            >
              {loadingCrimes == true && <Loading />}
              {loadingCrimes == false && !crimes && (
                <NotData error={errorQuery} />
              )}

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
      )}
    </>
  );
};
