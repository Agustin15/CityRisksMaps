import styles from "./ContainQuizes.module.css";
import iconQuizes from "../../../../assets/img/quizes.png";
import iconMinimize from "../../../../assets/img/minimize.png";
import { Table } from "../Table";
import { LoadDataQuizes } from "../loadDataQuizes/LoadDataQuizes";
import { resize } from "../../optionsMap/viewStatistics/functions.js";

export const ContainQuizes = ({ setShowViewStatistics }) => {
  return (
    <div className={styles.containData}>
      <div onClick={(event) => resize(event)} className={styles.deploy}></div>
      <div className={styles.header}>
        <div className={styles.close}>
          <button onClick={() => setShowViewStatistics(false)}>
            <img src={iconMinimize}></img>
          </button>
        </div>

        <div className={styles.title}>
          <h3>Encuestas de percepcion</h3>
          <img src={iconQuizes}></img>
        </div>
      </div>

      <LoadDataQuizes />

      <Table />
    </div>
  );
};
