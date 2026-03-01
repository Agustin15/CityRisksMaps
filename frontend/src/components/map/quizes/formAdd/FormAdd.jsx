import styles from "./FormAdd.module.css";
import iconQuiz from "../../../../assets/img/quizes.png";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { useFormQuiz } from "../../../../contexts/quizesContext/FormAddQuizContext";
import { VerifyEmail } from "../verifyEmail/VerifyEmail";
import { VerifyProvider } from "../../../../contexts/VerifyContext";
import { ContentForm } from "./contentForm/ContentForm";

export const FormAdd = () => {
  const [cookies] = useCookies();
  const { handleClose, handleSubmit, getNeighborhoodsNotUsed } = useFormQuiz();
  const { newQuiz } = useQuizes();

  useEffect(() => {
    if (!cookies.email || newQuiz != true) return;
    getNeighborhoodsNotUsed();
  }, [cookies.email]);

  return (
    <div className={styles.containForm}>
      <div className={styles.header}>
        <h3>Encuesta de percepcion</h3>
        <img src={iconQuiz}></img>

        <div className={styles.optionClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {!cookies.email && (
          <VerifyProvider>
            <VerifyEmail />
          </VerifyProvider>
        )}

        {cookies.email && <ContentForm cookies={cookies} />}
      </form>
    </div>
  );
};
