import styles from "./CrimeNeighbordhoods.module.css";
import iconKill from "../../../assets/img/kill.png";
import iconTheft from "../../../assets/img/theft.png";
import iconMinimize from "../../../assets/img/minimize.png";
import iconHoldup from "../../../assets/img/holdup.png";
import { Table } from "./table/Table";
import { LoadCrimesInNeighborhoods } from "./loadCrimeDataNeighborhoods/LoadCrimeDataNeighborhoods";

export const CrimeNeighbordhoods = ({
  categoryCrime,
  setShowViewStatistics
}) => {
  return (
    <div className={styles.containData}>
      <div className={styles.header}>
        <div className={styles.close}>
          <button onClick={() => setShowViewStatistics(false)}>
            <img src={iconMinimize}></img>
          </button>
        </div>
        <div className={styles.title}>
          <h3>{categoryCrime}s</h3>
          <img
            src={
              categoryCrime == "Hurto"
                ? iconHoldup
                : categoryCrime == "Rapiña"
                  ? iconTheft
                  : categoryCrime == "Homicidio"
                    ? iconKill
                    : ""
            }
          ></img>
        </div>
      </div>

      <LoadCrimesInNeighborhoods categoryCrime={categoryCrime} />

      <Table crime={categoryCrime} />
    </div>
  );
};
