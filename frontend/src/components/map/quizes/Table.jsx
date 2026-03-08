import styles from "./Table.module.css";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useMapControls } from "../../../contexts/MapContext";
import { useWindowResize } from "../../../contexts/WindowResizeContext.jsx";
import { useMap } from "@vis.gl/react-google-maps";
import { NotData } from "../notData/NotData";
import { Loading } from "../loading/Loading";
import { Rows } from "./rows/Rows";
import { focusPolygon } from "../crimeNeighData/table/functions.js";

export const Table = () => {
  const map = useMap();
  const { tableRef, loadingQuizes, neighborhoodsQuizesByYear, errorGetQuiz } =
    useQuizes();
  const { neighbordhoodsCoordinates } = useMapControls();
  const { loadingYears, polygons } = useZoneCrimes();
  const { windowWidth } = useWindowResize();

  const handleClickNeighborhood = (neighborhood) => {
    focusPolygon(neighbordhoodsCoordinates, neighborhood, polygons, map);
  };

  return (
    <div className={styles.containTable}>
      <table ref={tableRef} className={styles.table}>
        <thead>
          <tr>
            <th>Barrio</th>
            <th>Votos seguro</th>
            <th>Votos inseguo</th>
            <th>Encuestas</th>
            <th>Porcentaje votos seguros</th>
          </tr>
        </thead>

        <tbody>
          {loadingQuizes == true && (
            <tr>
              <td
                colSpan={windowWidth <= 650 ? 2 : 4}
                rowSpan={windowWidth <= 650 ? 2 : 4}
              >
                <Loading />
              </td>
            </tr>
          )}
          {loadingYears == false &&
            loadingQuizes == false &&
            !neighborhoodsQuizesByYear && (
              <tr>
                <td
                  colSpan={windowWidth <= 650 ? 2 : 4}
                  rowSpan={windowWidth <= "650" ? 2 : 4}
                >
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
  );
};
