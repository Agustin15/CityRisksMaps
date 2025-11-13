import styles from "./ContainQuizes.module.css";
import { useQuizes } from "../../../../contexts/QuizesContext";
import iconQuizes from "../../../../assets/img/quizes.png";
import { Table } from "../Table";


export const ContainQuizes = () => {
  const { setShowQuizes, neighborhoodsQuizesByYear } = useQuizes();

  const handleClose = () => {
    setShowQuizes(true);
  };

  return (
    <div className={styles.containData}>
      <div className={styles.header}>
        <div className={styles.close}>
          <button onClick={handleClose}>x</button>
        </div>
        <div className={styles.title}>
          <h3>Encuestas de percepcion</h3>
          <img src={iconQuizes}></img>
        </div>
      </div>

      {neighborhoodsQuizesByYear && <Table />}
    </div>
  );
};
