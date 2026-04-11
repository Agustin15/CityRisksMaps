import styles from "./Searcher.module.css";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { InputSearcher } from "./inputSearcher";

export const Searcher = ({ setElementSearchedNotFound }) => {
  const { tableRef } = useNeighborhoodsCrimes();

  return (
    <div className={styles.containSearcher}>
      <InputSearcher
        tableRef={tableRef}
        setElementSearchedNotFound={setElementSearchedNotFound}
      />
    </div>
  );
};
