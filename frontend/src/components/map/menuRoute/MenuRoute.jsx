import styles from "./MenuRoutes.module.css";
import iconDestiny from "../../../assets/img/destinyAddress.png";
import iconOrigin from "../../../assets/img/origin.png";
import iconShow from "../../../assets/img/showRoutes.png";
import { useRoutes } from "../../../contexts/RoutesContext";
import { useMapControls } from "../../../contexts/MapContext.jsx";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useState } from "react";
import { OptionsAddress } from "./optionsAddress/OptionsAddress.jsx";
import { Transports } from "./transports/Transports";
import { Advice } from "./advice/Advice.jsx";
import { getSuggestions, showRoutes } from "./functions.js";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext.jsx";

export const MenuRoute = () => {
  const [suggestions, setSuggestions] = useState();
  const [lastInputChanged, setLastInputChanged] = useState();
  const { destiny, origin, setOrigin, setDestiny, setShowMenuRoutes } =
    useRoutes();
  const { userLocation } = useMapControls();
  const { crimeSelected } = useZoneCrimes();
  const { showQuizes } = useQuizes();

  const handleChange = async (value, input) => {
    if (input == "origin") setOrigin(value);
    else setDestiny(value);

    setLastInputChanged(input);

    getSuggestions(userLocation, value, setSuggestions);
  };

  return (
    <div className={styles.menuRoute}>
      <div className={styles.close}>
        <button onClick={() => setShowMenuRoutes(false)}>x</button>
      </div>
      <Transports></Transports>
      <div className={styles.column}>
        <div className={styles.origin}>
          <label>Origen:</label>
          <div className={styles.row}>
            <img src={iconOrigin}></img>
            <input
              value={origin}
              onChange={(event) => handleChange(event.target.value, "origin")}
              type="text"
            ></input>
          </div>
        </div>
        <div className={styles.destiny}>
          <label>Destino:</label>
          <div className={styles.row}>
            <img src={iconDestiny}></img>
            <input
              onChange={(event) => handleChange(event.target.value, "destiny")}
              type="text"
              value={destiny}
            ></input>
          </div>
        </div>
        <button
          onClick={() => showRoutes(origin, destiny, "DRIVE")}
          className={
            destiny.length > 0 &&
            origin.length > 0 &&
            (crimeSelected == "Asesinato" || showQuizes)
              ? styles.btnEnabled
              : styles.btnDisabled
          }
        >
          Mostrar rutas
          <img src={iconShow}></img>
        </button>

        {crimeSelected != "Asesinato" && !showQuizes && <Advice />}
      </div>
      <OptionsAddress
        suggestions={suggestions}
        lastInputChanged={lastInputChanged}
      />
    </div>
  );
};
