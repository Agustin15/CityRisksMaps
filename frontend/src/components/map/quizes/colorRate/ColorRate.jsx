import styles from "./ColorRate.module.css";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";

export const ColorRate = ({ total, percentage }) => {
  const { getRangeSecureQuiz } = useQuizes();

  return (
    <div
      style={{
        background: total == 0 ? "#bbbbbbff" : getRangeSecureQuiz(percentage).color
      }}
      className={styles.referenceRange}
    ></div>
  );
};
