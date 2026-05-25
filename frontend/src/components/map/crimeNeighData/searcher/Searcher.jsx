import styles from "./Searcher.module.css";
import iconIncreaseColumnChart from "../../../../assets/img/increaseColumnChart.png";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { InputSearcher } from "./inputSearcher";

export const Searcher = ({ setElementSearchedNotFound, setShowChart }) => {
  const { tableRef } = useNeighborhoodsCrimes();

  return (
    <div className={styles.containSearcher}>
      <InputSearcher
        tableRef={tableRef}
        setElementSearchedNotFound={setElementSearchedNotFound}
      />
      <button onClick={() => setShowChart(true)} className={styles.btnIncrease}>
        <img src={iconIncreaseColumnChart}></img>
      </button>
    </div>
  );
};
