import styles from "./OptionsCrimes.module.css";
import iconKill from "../../../assets/img/kill.png";
import iconTheft from "../../../assets/img/theft.png";
import iconHoldup from "../../../assets/img/holdup.png";
import iconQuizes from "../../../assets/img/quizes.png";
import { useState } from "react";
import { useEffect } from "react";
import { useZoneCrimes } from "../../../contexts/ZoneCrimesContext";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { ContainQuizes } from "../quizes/containQuizes/ContainQuizes";
import { CrimeNeighbordhoods } from "./crimeNeighData/CrimeNeighbordhoods";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const OptionsCrimes = () => {
  const [crimes, setCrimes] = useState();
  const [crimeSelected, setCrimeSelected] = useState();
  const { loadCrimeDataNeighborhoods } = useZoneCrimes();
  const { setShowQuizes, showQuizes, loadDataQuizes } = useQuizes();

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
    loadDataQuizes();
    setShowQuizes(true);
  };

  return (
    <div className={styles.containOptionsCrimes}>
      <ul className={styles.menuOptionsCrimes}>
        {crimes && (
          <li>
            <button onClick={handleClickQuizes}>
              Encuestas percepcion
              <img src={iconQuizes}></img>
            </button>
          </li>
        )}
        {crimes &&
          crimes.map((crime, index) => (
            <li key={index}>
              <button
                onClick={() => handleClickOption(crime)}
                className={
                  crime.category == "Hurto"
                    ? styles.btnHurto
                    : crime.category == "Rapiña"
                    ? styles.btnRapinia
                    : crime.category == "Asesinato"
                    ? styles.btnAsesinato
                    : ""
                }
              >
                Zonas de {crime.category}
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
              </button>
            </li>
          ))}
      </ul>

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
