import styles from "./OptionsCrimes.module.css";
import iconKill from "../../../assets/img/kill.png";
import iconTheft from "../../../assets/img/theft.png";
import iconHoldup from "../../../assets/img/holdup.png";
import iconQuizes from "../../../assets/img/quizes.png";
import myLocation from "../../../assets/img/myLocation.png";
import { useState } from "react";
import { useEffect } from "react";
import { useZoneCrimes } from "../../../contexts/ZoneCrimesContext";
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
  };
  const handleClickQuizes = () => {
    if (!showQuizes) {
      loadDataQuizes();
      setShowQuizes(true);
    }
  };

  return (
    <div className={styles.containOptionsCrimes}>
      {crimes && (
        <ul className={styles.menuOptionsCrimes}>
          <div className={styles.contentMenu}>
            <li onClick={handleClickQuizes}>
              Percepcion
              <img src={iconQuizes}></img>
            </li>

            {crimes.map((crime, index) => (
              <li key={index} onClick={() => handleClickOption(crime)}>
                {crime.category}
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
          </div>
          <li className={styles.myLocation} onClick={handleMyLocation}>
            {loadingMyLocation ? "localizando..." : "Mi ubicacion"}
            <img src={myLocation}></img>
          </li>
        </ul>
      )}

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
