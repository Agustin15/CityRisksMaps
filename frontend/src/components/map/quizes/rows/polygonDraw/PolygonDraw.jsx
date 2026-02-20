import styles from "./PolygonDraw.module.css";
import iconQuizes from "../../../../../assets/img/quizes.png";
import iconLike from "../../../../../assets/img/like.png";
import iconDislike from "../../../../../assets/img/dislike.png";
import iconSecure from "../../../../../assets/img/security.png";
import { useEffect, useRef, useState } from "react";
import { useMapControls } from "../../../../../contexts/MapContext";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext";
import { drawShape } from "../../../crimeNeighData/table/rows/detailsRow/polygonDraw/functions.js";

export const PolygonDraw = ({ quiz }) => {
  const { neighbordhoodsCoordinates } = useMapControls();
  const { getRangeSecureQuiz } = useQuizes();
  const [drawn, setDrawn] = useState(false);
  const refCanvasPolygon = useRef();

  useEffect(() => {
    if (drawn) return;
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
      setDrawn(true);
    }
  };

  return (
    <div className={styles.containPolygon}>
      <ul>
        <li>
          <img src={iconQuizes}></img>
          <label>Total de votos:</label>
          <span>{quiz.total}</span>
        </li>
        <li>
          <img src={iconLike}></img>
          <label>Votos seguro:</label>
          <span>{quiz.secure}</span>
        </li>
        <li>
          <img src={iconDislike}></img>
          <label>Votos inseguro:</label>
          <span>{quiz.insecure}</span>
        </li>
        <li>
          <img src={iconSecure}></img>
          <label>Porcentaje de votos seguros:</label>
          <span>
            {quiz.total == 0 ? "Sin encuestas" : quiz.percentage + "%"}
          </span>
        </li>
      </ul>
      <canvas className={styles.canvas} ref={refCanvasPolygon}></canvas>
    </div>
  );
};
