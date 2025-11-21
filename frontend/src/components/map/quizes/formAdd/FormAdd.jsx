import styles from "./FormAdd.module.css";
import { useMapControls } from "../../../../contexts/MapContext";
import { Reasons } from "./reasons/Reasons";
import { useFormQuiz } from "../../../../contexts/FormAddQuizContext";

export const FormAdd = () => {
  const { neighbordhoodsCoordinates } = useMapControls();
  const {
    emailEntered,
    msjErrorEmail,
    handleEmailChanged,
    handleClose,
    handleSubmit,
    allTypeCrimes
  } = useFormQuiz();

  const abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "Ñ",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];

  const orderNeighborhoodsByAlphabet = () => {
    const neighborhoodsOrderByAlphabet = [];
    abc.forEach((letter) => {
      neighbordhoodsCoordinates.forEach((neighborhoodCoord) => {
        if (letter == neighborhoodCoord.neighborhood.substring(0, 1))
          neighborhoodsOrderByAlphabet.push(neighborhoodCoord.neighborhood);
      });
    });

    return neighborhoodsOrderByAlphabet;
  };

  return (
    <div className={styles.containForm}>
      <div className={styles.header}>
        <h3>Encuesta de percepcion</h3>
        <div className={styles.optionClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.column}>
          <label>Correo:</label>
          <input
            autoComplete="off"
            type="email"
            name="email"
            placeholder="Ingrese su correo"
            value={emailEntered}
            onChange={(event) => handleEmailChanged(event.target.value)}
          ></input>
          {msjErrorEmail && <p>{msjErrorEmail}</p>}
        </div>

        <div className={styles.column}>
          <label>Barrio:</label>
          <select name="neighborhood">
            {orderNeighborhoodsByAlphabet().map((neighborhood, index) => (
              <option key={index} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.perception}>
          <label className={styles.lblTitle}>Percepcion:</label>
          <div className={styles.columnPerception}>
            <div className={styles.rowPerception}>
              <input type="radio" name="perception" value={"secure"}></input>
              <label>Seguro</label>
            </div>
            <div className={styles.rowPerception}>
              <input type="radio" name="perception" value={"insecure"}></input>
              <label>Inseguro</label>
            </div>
          </div>
        </div>

        <Reasons />

        {allTypeCrimes && (
          <button type="submit" className={styles.send}>
            Enviar
          </button>
        )}
      </form>
    </div>
  );
};
