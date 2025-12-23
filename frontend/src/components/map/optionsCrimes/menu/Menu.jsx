import styles from "../OptionsCrimes.module.css";
import iconKill from "../../../../assets/img/killMenu.png";
import iconTheft from "../../../../assets/img/theftMenu.png";
import iconHoldup from "../../../../assets/img/holdupMenu.png";
import iconQuizes from "../../../../assets/img/quizesMenu.png";
import myLocation from "../../../../assets/img/myLocation.png";
import { useMapControls } from "../../../../contexts/MapContext";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export const Menu = ({ crimes }) => {
  const { loadCrimeDataNeighborhoods, crimeSelected, setCrimeSelected } =
    useZoneCrimes();
  const { handleMyLocation, loadingMyLocation } = useMapControls();
  const { setShowQuizes, showQuizes, loadDataQuizes } = useQuizes();
  const map = useMap();

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
    <ul className={styles.menuOptionsCrimes}>
      <li
        className={showQuizes ? styles.selected : ""}
        onClick={handleClickQuizes}
      >
        <img src={iconQuizes}></img>
        Encuestas
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
          {crime.category}
        </li>
      ))}
      {/* <li className={styles.myLocation} onClick={handleMyLocation}>
        <img src={myLocation}></img>
        {loadingMyLocation ? "Localizando" : "Localizar"}
      </li> */}
    </ul>
  );
};
