import { useQuizes } from "../../../../contexts/QuizesContext";
import styles from "./ColorRate.module.css";

export const ColorRate = ({ total, percentage }) => {
  const { getRangeSecureQuiz } = useQuizes();

  return (
    <div
      style={{
        background: total == 0 ? "#bbbbbbff" : getRangeSecureQuiz(percentage)
      }}
      className={styles.referenceRange}
    ></div>
  );
};
