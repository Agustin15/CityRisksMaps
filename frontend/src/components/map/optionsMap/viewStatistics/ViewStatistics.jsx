import styles from "./ViewStatistics.module.css";
import { useMapControls } from "../../../../contexts/MapContext";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useState, useEffect } from "react";
import { Menu } from "./menu/Menu.jsx";
import { Loading } from "../../quizes/formAdd/loading/Loading.jsx";
import { NotData } from "../../notData/NotData.jsx";
import { ContainQuizes } from "../../quizes/containQuizes/ContainQuizes.jsx";
import { CrimeNeighbordhoods } from "../../crimeNeighData/CrimeNeighbordhoods.jsx";
import { getCrimes } from "./functions.js";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext.jsx";

export const ViewStatistics = () => {
  const [crimes, setCrimes] = useState();
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [errorQuery, setErrorQuery] = useState();
  const { crimeSelected, setCrimeSelected, loadCrimeDataNeighborhoods } =
    useZoneCrimes();
  const { neighbordhoodsCoordinates } = useMapControls();
  const { showQuizes } = useQuizes();

  useEffect(() => {
    if (!neighbordhoodsCoordinates) return;
    loadData();
  }, [neighbordhoodsCoordinates]);

  const loadData = async () => {
    const crimes = await getCrimes(setLoadingCrimes, setErrorQuery);
    if (crimes) {
      setCrimes(crimes);
      setCrimeSelected(crimes[0].category);
      loadCrimeDataNeighborhoods(crimes[0].category);
    }
  };

  return (
    <>
      {loadingCrimes == false && crimes && <Menu crimes={crimes} />}
      <div className={styles.viewStatistics}>
        {crimeSelected && (
          <div className={styles.containOptionsCrimes}>
            {loadingCrimes == true && <Loading />}
            {loadingCrimes == false && !crimes && (
              <NotData error={errorQuery} />
            )}

            {crimeSelected && (
              <CrimeNeighbordhoods
                categoryCrime={crimeSelected}
                setCrimeSelected={setCrimeSelected}
              />
            )}
          </div>
        )}
        {showQuizes && <ContainQuizes />}
      </div>
    </>
  );
};
