import styles from "./FormAdd.module.css";
import { useMapControls } from "../../../../contexts/MapContext";
import { Reasons } from "./reasons/Reasons";
import { useFormQuiz } from "../../../../contexts/quizesContext/FormAddQuizContext";
import { Perception } from "./perception/Perception";
import { useCookies } from "react-cookie";
import { VerifyEmail } from "./verifyEmail/VerifyEmail";

export const FormAdd = () => {
  const [cookies] = useCookies();

  const { neighbordhoodsCoordinates } = useMapControls();
  const {
    handleClose,
    handleSubmit,
    allTypeCrimes,
    setValuesForm,
    valuesForm
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

    neighborhoodsOrderByAlphabet.unshift("Seleccionar");

    return neighborhoodsOrderByAlphabet;
  };

  const handleChange = (event) => {
    let { name, value } = event;

    if (name == "reasons") {
      if (valuesForm.reasons.find((reason) => reason == value)) {
        setValuesForm({
          ...valuesForm,
          [name]: valuesForm.reasons.filter((reason) => reason != value)
        });
      } else {
        setValuesForm({
          ...valuesForm,
          [name]: [...valuesForm.reasons, value]
        });
      }
    } else {
      if (name == "perception") value = value == "secure" ? 1 : 0;

      setValuesForm({ ...valuesForm, [name]: value });
    }
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
        {!cookies.email ? (
          <VerifyEmail />
        ) : (
          <label>Correo: {cookies.email}</label>
        )}

        {cookies.email && (
          <>
            <div className={styles.column}>
              <label>Barrio:</label>
              <select
                onChange={(event) => handleChange(event.target)}
                name="neighborhoodSelected"
              >
                {orderNeighborhoodsByAlphabet().map((neighborhood, index) => (
                  <option key={index} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            <Perception handleChange={handleChange} />

            <Reasons handleChange={handleChange} />

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
