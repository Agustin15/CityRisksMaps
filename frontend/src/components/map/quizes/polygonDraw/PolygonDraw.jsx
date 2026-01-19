import styles from "./PolygonDraw.module.css";
import iconQuizes from "../../../../assets/img/quizes.png";
import iconLike from "../../../../assets/img/like.png";
import iconDislike from "../../../../assets/img/dislike.png";
import iconSecure from "../../../../assets/img/security.png";
import { useEffect, useRef } from "react";
import { useMapControls } from "../../../../contexts/MapContext";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { drawShape } from "../../crimeNeighData/table/polygonDraw/functions.js";

export const PolygonDraw = ({ quiz }) => {
  const { neighbordhoodsCoordinates } = useMapControls();
  const { getRangeSecureQuiz } = useQuizes();
  const refCanvasPolygon = useRef();

  useEffect(() => {
    draw();
  }, []);

  const draw = () => {
    if (refCanvasPolygon.current) {
      const canvas = refCanvasPolygon.current;
      const ctx = canvas.getContext("2d");

      const neighborhoodCoordinates = neighbordhoodsCoordinates.find(
        (nhCoord) => {
          return nhCoord.neighborhood == quiz.name;
        }
      );

      const rateColor =
        quiz.total == 0
          ? "#bbbbbbff"
          : getRangeSecureQuiz(quiz.percentage).color;

      drawShape(neighborhoodCoordinates, canvas, ctx, rateColor);
    }
  };

  return (
    <div className={styles.containPolygon}>
      <ul>
        <li>
          <img src={iconQuizes}></img>
          <label>Cantidad de encuestas:</label>
          <span>{quiz.total}</span>
        </li>
        <li>
          <img src={iconLike}></img>
          <label>Puntuacion de seguridad:</label>
          <span>{quiz.secure}</span>
        </li>
        <li>
          <img src={iconDislike}></img>
          <label>Puntuacion de inseguridad:</label>
          <span>{quiz.insecure}</span>
        </li>
        <li>
          <img src={iconSecure}></img>
          <label>Porcentaje de seguridad:</label>
          <span>
            {quiz.total == 0 ? "Sin encuestas" : quiz.percentage + "%"}
          </span>
        </li>
      </ul>
      <canvas className={styles.canvas} ref={refCanvasPolygon}></canvas>
    </div>
  );
};
