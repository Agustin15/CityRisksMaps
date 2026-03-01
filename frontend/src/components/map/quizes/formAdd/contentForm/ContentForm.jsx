import styles from "./ContentForm.module.css";
import iconQuiz from "../../../../../assets/img/quizes.png";
import { useFormQuiz } from "../../../../../contexts/quizesContext/FormAddQuizContext";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext";
import { Reasons } from "./reasons/Reasons";
import { Perception } from "./perception/Perception";
import { Neighborhood } from "./neighborhood/Neighborhood";
import { NotData } from "./notData/NotData";
import { Loading } from "./loading/Loading";

export const ContentForm = ({ cookies }) => {
  const {
    loadingNeigh,
    loading,
    allTypeCrimes,
    neighborhoodsNotUsed,
    setValuesForm,
    valuesForm
  } = useFormQuiz();

  const { newQuiz } = useQuizes();

  return (
    <div className={styles.addQuiz}>
      <label className={styles.email}>Correo: {cookies.email}</label>

      {loadingNeigh && <Loading />}

      {loadingNeigh == false && !neighborhoodsNotUsed && newQuiz == true && (
        <NotData msj={"No hay registros de barrios en el sistema"} />
      )}

      {loadingNeigh == false && (neighborhoodsNotUsed || newQuiz != true) && (
        <Neighborhood valuesForm={valuesForm} setValuesForm={setValuesForm} />
      )}

      <Perception valuesForm={valuesForm} setValuesForm={setValuesForm} />

      <Reasons valuesForm={valuesForm} setValuesForm={setValuesForm} />

      {allTypeCrimes && (neighborhoodsNotUsed || newQuiz != true) && (
        <button type="submit" className={styles.send} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      )}
    </div>
  );
};
