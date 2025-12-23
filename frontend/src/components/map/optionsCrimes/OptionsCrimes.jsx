import styles from "./OptionsCrimes.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { useMap } from "@vis.gl/react-google-maps";
import { ContainQuizes } from "../quizes/containQuizes/ContainQuizes";
import { CrimeNeighbordhoods } from "./crimeNeighData/CrimeNeighbordhoods";
import { Menu } from "./menu/Menu";

const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const OptionsCrimes = () => {
  const [crimes, setCrimes] = useState();
  const map = useMap();
  const { crimeSelected, setCrimeSelected } = useZoneCrimes();
  const { showQuizes } = useQuizes();

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
    if (!map) return;
    getCrimes();
  }, [map]);

  return (
    <div className={styles.containOptionsCrimes}>
      {crimes && <Menu crimes={crimes} />}
      {crimeSelected && (
        <CrimeNeighbordhoods
          categoryCrime={crimeSelected}
          setCrimeSelected={setCrimeSelected}
        />
      )}

      {!crimeSelected && !showQuizes && (
        <div className={styles.welcome}>
          <h3>¡Bienvenido!</h3>
          <p>Elija una opcion para visualizar los datos</p>
        </div>
      )}

      {showQuizes && <ContainQuizes />}
    </div>
  );
};
