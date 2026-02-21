import styles from "./Neighborhood.module.css";
import { useEffect } from "react";
import { useFormQuiz } from "../../../../../contexts/quizesContext/FormAddQuizContext.jsx";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext.jsx";
import { handleChange } from "../functions.js";

export const Neighborhood = ({ valuesForm, setValuesForm }) => {
  const { neighborhoodsNotUsed } = useFormQuiz();
  const { newQuiz } = useQuizes();

  useEffect(() => {
    if (newQuiz == true) return;

    handleChange(
      { name: "neighborhoodSelected", value: newQuiz },
      valuesForm,
      setValuesForm
    );
  }, []);

  return (
    <div className={styles.column}>
      <label>Barrio:</label>
      <select
        onChange={(event) =>
          handleChange(event.target, valuesForm, setValuesForm)
        }
        name="neighborhoodSelected"
      >
        {neighborhoodsNotUsed ? (
          neighborhoodsNotUsed.map((neighborhood, index) => (
            <option key={index} value={neighborhood.name}>
              {neighborhood.name}
            </option>
          ))
        ) : (
          <option value={newQuiz}>{newQuiz}</option>
        )}
      </select>
    </div>
  );
};
