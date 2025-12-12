import styles from "./Table.module.css";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useMapControls } from "../../../contexts/MapContext";
import { useMap } from "@vis.gl/react-google-maps";
import { NotData } from "../notData/NotData";
import { Loading } from "../loading/Loading";
import { Rows } from "./rows/Rows";
import { focusPolygon } from "../optionsCrimes/crimeNeighData/table/focusPolygon.js";

export const Table = () => {
  const map = useMap();
  const { loadingQuizes, neighborhoodsQuizesByYear, errorGetQuiz } =
    useQuizes();
  const { neighbordhoodsCoordinates } = useMapControls();
  const { loadingYears, polygons } = useZoneCrimes();

  const handleClickNeighborhood = (neighborhood) => {
    focusPolygon(neighbordhoodsCoordinates, neighborhood, polygons, map);
  };

  return (
    <div className={styles.containTable}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Barrio</th>
              <th>Puntuacion seguridad</th>
              <th>Puntuacion inseguridad</th>
              <th>Encuestas</th>
              <th>Porcentaje de seguridad</th>
            </tr>
          </thead>

          <tbody>
            {loadingQuizes == true && (
              <tr>
                <td colSpan={4} rowSpan={4}>
                  <Loading />
                </td>
              </tr>
            )}
            {loadingYears == false &&
              loadingQuizes == false &&
              !neighborhoodsQuizesByYear && (
                <tr>
                  <td colSpan={4} rowSpan={4}>
                    <NotData error={errorGetQuiz} />
                  </td>
                </tr>
              )}
            {loadingQuizes == false &&
              neighborhoodsQuizesByYear &&
              neighborhoodsQuizesByYear.map((quiz, index) => (
                <Rows
                  key={index}
                  numberRow={index}
                  quiz={quiz}
                  handleClickNeighborhood={handleClickNeighborhood}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
