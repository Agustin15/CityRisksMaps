import styles from "./PolygonDraw.module.css";
import iconQuizes from "../../../../assets/img/quizes.png";
import iconLike from "../../../../assets/img/like.png";
import iconDislike from "../../../../assets/img/dislike.png";
import iconSecure from "../../../../assets/img/security.png";
import { useEffect, useRef } from "react";
import { useMapControls } from "../../../../contexts/MapContext";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";

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

      ctx.beginPath();
      ctx.fillStyle = rateColor;

      ctx.moveTo(20, 20);

      const lats = neighborhoodCoordinates.coordinates.map(
        (nhCoord) => nhCoord.lat
      );

      const lngs = neighborhoodCoordinates.coordinates.map(
        (nhCoord) => nhCoord.lng
      );

      const latMax = Math.max(...lats);
      const latMin = Math.min(...lats);
      const lngMax = Math.max(...lngs);
      const lngMin = Math.min(...lngs);

      //escala para que entre el polygono en canva

      const scaleX = canvas.width / (lngMax - lngMin);
      const scaleY = canvas.height / (latMax - latMin);

      neighborhoodCoordinates.coordinates.forEach((coord, index) => {
        //convertir lat y lng a x,y en pixels
        const x = (coord.lng - lngMin) * scaleX;
        const y = canvas.height - (coord.lat - latMin) * scaleY;

        if (index == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      ctx.stroke();
      ctx.fill();
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
