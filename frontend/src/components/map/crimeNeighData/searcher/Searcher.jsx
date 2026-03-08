import styles from "./Searcher.module.css";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { InputSearcher } from "./inputSearcher";

export const Searcher = () => {
  const { tableRef } = useZoneCrimes();

  return (
    <div className={styles.containSearcher}>
      <InputSearcher tableRef={tableRef} />
    </div>
  );
};
