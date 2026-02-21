import styles from "./InfoWindowNeighborhood.module.css";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { useRef } from "react";

export const InfoWindowNeighborhood = ({ polygonSelected }) => {
  const { setNewQuiz, newQuiz } = useQuizes();
  const window = useRef();

  const handleNewQuiz = () => {
    if (!newQuiz) setNewQuiz(polygonSelected.data.name);
  };

  return (
    <div ref={window} className={styles.infoWindowPolygon}>
      <div className={styles.row}>
        <span>
          {polygonSelected.data.name}
          {polygonSelected.data.type == "crime"
            ? " (Tasa de " + polygonSelected.data.categoryCrime + "s: "
            : " (Percepcion:"}
          {polygonSelected.data.rateLevel + ")"}
        </span>

        <div style={{ background: polygonSelected.data.rateColor }}></div>
      </div>

      {polygonSelected.data.type == "crime" && (
        <>
          <p>
            Poblacion:{polygonSelected.data.population.toLocaleString()}{" "}
            habitantes
          </p>

          <p>
            Denuncias de
            {" " +
              polygonSelected.data.categoryCrime +
              "s:" +
              +(polygonSelected.data.quantityCrime == null
                ? "Sin Datos"
                : polygonSelected.data.quantityCrime)}
          </p>
          <p>
            Tasa de denuncias cada 100.000 habitantes:
            {polygonSelected.data.rate}
          </p>
        </>
      )}

      {polygonSelected.data.type == "quiz" && (
        <>
          <p>
            Percepcion de seguridad:
            {polygonSelected.data.total == 0
              ? "Sin encuestas"
              : polygonSelected.data.percentage + "%"}
          </p>
          <button onClick={handleNewQuiz}>Agregar encuesta</button>
        </>
      )}
    </div>
  );
};
