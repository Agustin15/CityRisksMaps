import styles from "./OptionsCrimes.module.css";
import iconKill from "../../../assets/img/kill.png";
import iconTheft from "../../../assets/img/theft.png";
import iconHoldup from "../../../assets/img/holdup.png";
import iconQuizes from "../../../assets/img/quizes.png";
import myLocation from "../../../assets/img/myLocation.png";
import { useState } from "react";
import { useEffect } from "react";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useMapControls } from "../../../contexts/MapContext";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { ContainQuizes } from "../quizes/containQuizes/ContainQuizes";
import { CrimeNeighbordhoods } from "./crimeNeighData/CrimeNeighbordhoods";

const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const OptionsCrimes = () => {
  const [crimes, setCrimes] = useState();
  const [crimeSelected, setCrimeSelected] = useState();
  const { loadCrimeDataNeighborhoods } = useZoneCrimes();
  const { setShowQuizes, showQuizes, loadDataQuizes } = useQuizes();
  const { handleMyLocation, loadingMyLocation } = useMapControls();

  const getCrimes = async () => {
    let optionGET = JSON.stringify({ option: "getCrimes" });

    try {
      const response = await fetch(localhostBackend + "/crimes/" + optionGET, {
        method: "GET",
        headers: { "Content-type": "application/json" }
      });

      const result = await response.json();
      if (!response.ok) throw result.messageError;

      if (result) setCrimes(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCrimes();
  }, []);

  const handleClickOption = (crime) => {
    loadCrimeDataNeighborhoods(crime.category);
    setCrimeSelected(crime.category);
    setShowQuizes();
  };
  const handleClickQuizes = () => {
    if (!showQuizes) {
      setCrimeSelected();
      loadDataQuizes();
      setShowQuizes(true);
    }
  };

  return (
    <div className={styles.containOptionsCrimes}>
      {crimeSelected && (
        <CrimeNeighbordhoods
          categoryCrime={crimeSelected}
          setCrimeSelected={setCrimeSelected}
        />
      )}
      {showQuizes && <ContainQuizes />}

      {crimes && (
        <ul className={styles.menuOptionsCrimes}>
          <li
            className={showQuizes ? styles.selected : ""}
            onClick={handleClickQuizes}
          >
            <img src={iconQuizes}></img>
          </li>

          {crimes.map((crime, index) => (
            <li
              className={crime.category == crimeSelected ? styles.selected : ""}
              key={index}
              onClick={() => handleClickOption(crime)}
            >
              <img
                src={
                  crime.category == "Hurto"
                    ? iconTheft
                    : crime.category == "Rapiña"
                    ? iconHoldup
                    : crime.category == "Asesinato"
                    ? iconKill
                    : ""
                }
              ></img>
            </li>
          ))}
          <li className={styles.myLocation} onClick={handleMyLocation}>
            <img src={myLocation}></img>
            {loadingMyLocation ? "localizando" : ""}
          </li>
        </ul>
      )}
    </div>
  );
};
