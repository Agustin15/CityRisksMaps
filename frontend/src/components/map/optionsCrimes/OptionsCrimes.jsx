import { useState } from "react";
import { useEffect } from "react";
import iconKill from "../../../assets/img/kill.png";
import iconTheft from "../../../assets/img/theft.png";
import iconHoldup from "../../../assets/img/holdup.png";
import styles from "./OptionsCrimes.module.css";
import { useZoneCrimes } from "../../../contexts/ZoneCrimesContext";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const OptionsCrimes = () => {
  const [crimes, setCrimes] = useState();
  const { getNeighborhoodsCrimeByYear } = useZoneCrimes();

  const getCrimes = async () => {
    let optionGET = JSON.stringify({ option: "getCrimes" });

    try {
      const response = await fetch(localhostBackend + "/crimes/" + optionGET, {
        method: "GET",
        headers: { "Content-type": "application/json" }
      });

      const result = await response.json();

      if (result) setCrimes(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCrimes();
  }, []);

  const handleShowZones = (event, categoryCrime) => {
    getNeighborhoodsCrimeByYear(new Date().getFullYear(), categoryCrime);
  };

  return (
    <ul className={styles.menuOptionPolygons}>
      {crimes &&
        crimes.map((crime, index) => (
          <li key={index}>
            <button
              onClick={(event) => handleShowZones(event, crime.category)}
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
  );
};
