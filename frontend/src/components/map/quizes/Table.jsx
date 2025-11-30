import styles from "./Table.module.css";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { NotData } from "../notData/NotData";
import { Loading } from "../loading/Loading";
import { Rows } from "./rows/Rows";

export const Table = () => {
  const { loadingQuizes, neighborhoodsQuizesByYear } = useQuizes();
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
            {loadingQuizes && (
              <tr>
                <td colSpan={4} rowSpan={4}>
                  <Loading />
                </td>
              </tr>
            )}
            {!loadingQuizes && !neighborhoodsQuizesByYear && (
              <tr>
                <td colSpan={4} rowSpan={4}>
                  <NotData />
                </td>
              </tr>
            )}
            {!loadingQuizes &&
              neighborhoodsQuizesByYear &&
              neighborhoodsQuizesByYear.map((quiz, index) => (
                <Rows key={index} numberRow={index} quiz={quiz} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
