import styles from "./LoadDataQuizes.module.css";
import iconAdd from "../../../../assets/img/add.png";
import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";
import { Loading } from "../../loading/Loading";
import { FilterYears } from "../../filterYears/FilterYears";
import { References } from "../references/References";
import { useQuizes } from "../../../../contexts/QuizesContext";

export const LoadDataQuizes = () => {
  const { loadingYears, years } = useZoneCrimes();
  const { setNewQuiz, newQuiz } = useQuizes();

  return (
    <div className={styles.containDetails}>
      {loadingYears && <Loading />}

      <div className={styles.containAdd}>
        <button
          onClick={() => {
            if (!newQuiz) setNewQuiz(true);
          }}
        >
          Nueva encuesta <img src={iconAdd}></img>
        </button>
      </div>
      {!loadingYears && years && (
        <>
          <p>
            Los datos mostrados a continuacion son resultados de los opiniones
            de los usuarios sobre cada barrio, votando si es seguro o no.
          </p>

          <References />
          <FilterYears />
        </>
      )}
    </div>
  );
};
