import { useQuizes } from "../../../contexts/QuizesContext";
import { Loading } from "../optionsCrimes/crimeNeighData/loading/Loading";
import { NotData } from "../optionsCrimes/crimeNeighData/notData/NotData";
import styles from "./Table.module.css";

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
            {/* {!loadingQuizes &&
              neighborhoodsQuizesByYear &&
              neighborhoodsQuizesByYear.map((neighborhoodQuiz, index) => (
                // <Rows
                //   key={index}
                //   neighborhoodCrime={neighborhoodQuiz}
                //   handleClickNeighborhood={handleClickNeighborhood}
                //   crime={crime}
                //   numberRow={index}
                // />
              ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};
