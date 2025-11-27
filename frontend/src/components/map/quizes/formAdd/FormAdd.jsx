import styles from "./FormAdd.module.css";
import { useMapControls } from "../../../../contexts/MapContext";
import { Reasons } from "./reasons/Reasons";
import { useFormQuiz } from "../../../../contexts/FormAddQuizContext";
import { Perception } from "./perception/Perception";
import { useCookies } from "react-cookie";
import { VerifyEmail } from "./verifyEmail/VerifyEmail";

export const FormAdd = () => {
  const [cookies] = useCookies();

  const { neighbordhoodsCoordinates } = useMapControls();
  const {
    emailEntered,
    msjErrorEmail,
    handleEmailChanged,
    handleClose,
    handleSubmit,
    allTypeCrimes,
    setPerceptionSelected
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
        {!cookies.email ? <VerifyEmail /> : <label>{cookies.email}</label>}

        {cookies.email && (
          <>
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

            <Perception setPerceptionSelected={setPerceptionSelected} />

            <Reasons />

            {allTypeCrimes && (
              <button type="submit" className={styles.send}>
                Enviar
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
};
