import styles from "./Searcher.module.css";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext";
import { InputSearcher } from "../../../crimeNeighData/searcher/inputSearcher";

export const Searcher = () => {
  const { tableRef } = useQuizes();

  return (
    <div className={styles.containSearcher}>
      <InputSearcher tableRef={tableRef} />
    </div>
  );
};
