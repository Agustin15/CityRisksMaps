import styles from "./OptionsCrimes.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { useMapControls } from "../../../contexts/MapContext";
import { ContainQuizes } from "../quizes/containQuizes/ContainQuizes";
import { CrimeNeighbordhoods } from "./crimeNeighData/CrimeNeighbordhoods";
import { Menu } from "./menu/Menu";
import { Loading } from "../loading/Loading";
import { NotData } from "../notData/NotData";
import { getCrimes } from "./functions";

export const OptionsCrimes = () => {
  const [crimes, setCrimes] = useState();
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [errorQuery, setErrorQuery] = useState();
  const { showQuizes } = useQuizes();
  const { neighbordhoodsCoordinates } = useMapControls();
  const { crimeSelected, setCrimeSelected, loadCrimeDataNeighborhoods } =
    useZoneCrimes();

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
    <div className={styles.containOptionsCrimes}>
      {loadingCrimes == true && <Loading />}
      {loadingCrimes == false && !crimes && <NotData error={errorQuery} />}
      {loadingCrimes == false && crimes && <Menu crimes={crimes} />}

      {crimeSelected && (
        <CrimeNeighbordhoods
          categoryCrime={crimeSelected}
          setCrimeSelected={setCrimeSelected}
        />
      )}

      {showQuizes && <ContainQuizes />}
    </div>
  );
};
