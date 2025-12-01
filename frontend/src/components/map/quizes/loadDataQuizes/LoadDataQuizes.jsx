import styles from "./LoadDataQuizes.module.css";
import iconAdd from "../../../../assets/img/add.png";
import iconEdit from "../../../../assets/img/edit.png";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";
import { Loading } from "../../loading/Loading";
import { FilterYears } from "../../filterYears/FilterYears";
import { References } from "../references/References";

export const LoadDataQuizes = () => {
  const { loadingYears, years } = useZoneCrimes();
  const { setNewQuiz, newQuiz } = useQuizes();

  return (
    <div className={styles.containDetails}>
      {loadingYears && <Loading />}

      <div className={styles.containOptionsQuiz}>
        <button
          className={styles.btnAddQuiz}
          onClick={() => {
            if (!newQuiz) setNewQuiz(true);
          }}
        >
          Nueva encuesta <img src={iconAdd}></img>
        </button>
        <button className={styles.btnEditQuiz}>
          Editar encuesta <img src={iconEdit}></img>
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
