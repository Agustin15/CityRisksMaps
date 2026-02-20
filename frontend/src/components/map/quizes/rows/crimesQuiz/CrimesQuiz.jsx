import styles from "./CrimesQuiz.module.css";
import { useEffect, useState } from "react";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { getCrimesQuizNeighborhood, calculatePercentage } from "./functions";

export const CrimesQuiz = ({ neighborhood }) => {
  const [crimesNeighborhood, setCrimesNeighborhood] = useState();
  const [errorQuery, setErrorQuery] = useState();
  const { yearSelected } = useZoneCrimes();

  useEffect(() => {
    if (crimesNeighborhood) return;

    getCrimesQuizNeighborhood(
      neighborhood,
      yearSelected,
      setErrorQuery,
      setCrimesNeighborhood
    );
  }, []);

  return (
    <div className={styles.containCrimesQuizesNeighborhood}>
      <h3>Delitos señalados mas comunes en el barrio:</h3>
      <ul>
        {crimesNeighborhood &&
          crimesNeighborhood.map((crimeNeighborhood, index) => (
            <li key={index}>
              <span>
                {crimeNeighborhood.crime +
                  ":" +
                  calculatePercentage(
                    crimesNeighborhood,
                    crimeNeighborhood.amount
                  ) +
                  "%"}
              </span>
            </li>
          ))}
      </ul>
      {errorQuery && <span>{errorQuery}</span>}
    </div>
  );
};
