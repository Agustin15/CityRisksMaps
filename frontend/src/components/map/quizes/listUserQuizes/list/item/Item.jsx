import styles from "./Item.module.css";
import iconDelete from "../../../../../../assets/img/deleteQuiz.png";
import {
  alertSwalConfirmDeleteQuiz,
  alertSwalSuccess
} from "../../../../../sweetAlert/sweetAlert.js";
import { useListQuizes } from "../../../../../../contexts/quizesContext/ListQuizesContext.jsx";

export const Item = ({ quiz, indexItem }) => {
  const {
    deleteQuiz,
    resultQuizes,
    setIndex,
    index,
    refSelectYear,
    getLimitQuizesByParticipantAndYear
  } = useListQuizes();

  const handleDelete = async (idQuiz, neighborhood) => {
    const msj = `¿Desea eliminar esta encuesta sobre ${neighborhood}?`;
    const result = await alertSwalConfirmDeleteQuiz(msj);

    if (result.isConfirmed) {
      const deleted = await deleteQuiz(idQuiz);

      if (deleted) {
        alertSwalSuccess("¡Encuesta eliminada exitosamente!");
        let newIndex = index;

        if (resultQuizes.length == 1 && index != 0) {
          newIndex--;
          setIndex(newIndex);
        }

        await getLimitQuizesByParticipantAndYear(
          refSelectYear.current.value,
          newIndex
        );
      }
    }
  };

  return (
    <li
      className={indexItem % 2 == 0 ? styles.liWhite : styles.liGray}
      key={indexItem}
    >
      <div className={styles.columnOne}>
        <span className={styles.neighborhood}>
          <b>Barrio:</b>
          {quiz.neighborhood}
        </span>
        <span className={styles.neighborhood}>
          <b>Percepcion:</b>
          <div className={quiz.secure ? styles.secure : styles.insecure}></div>
          {quiz.secure ? "Seguro" : "Inseguro"}
        </span>
        <span>
          <b>Delitos usuales en el barrio:</b>
          {quiz.crimesQuiz.length > 0
            ? quiz.crimesQuiz.map((quizCrime, index) => (
                <span key={index}>
                  {quizCrime.crime}
                  {index < quiz.crimesQuiz.length - 1 ? " - " : ""}
                </span>
              ))
            : "No se señalaron delitos"}
        </span>
      </div>
      <button
        onClick={() => handleDelete(quiz.idQuiz, quiz.neighborhood)}
        className={styles.btnDelete}
      >
        <img src={iconDelete}></img>
      </button>
    </li>
  );
};
