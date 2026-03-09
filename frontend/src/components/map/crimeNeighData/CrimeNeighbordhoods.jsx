import styles from "./CrimeNeighbordhoods.module.css";
import iconKill from "../../../assets/img/kill.png";
import iconTheft from "../../../assets/img/theft.png";
import iconMinimize from "../../../assets/img/minimize.png";
import iconHoldup from "../../../assets/img/holdup.png";
import { Table } from "./table/Table";
import { LoadCrimesInNeighborhoods } from "./loadCrimeDataNeighborhoods/LoadCrimeDataNeighborhoods";
import { useState } from "react";

export const CrimeNeighbordhoods = ({
  categoryCrime,
  setShowViewStatistics
}) => {
  const [elementSearchedNotFound, setElementSearchedNotFound] = useState(false);

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
                ? iconTheft
                : categoryCrime == "Rapiña"
                  ? iconHoldup
                  : categoryCrime == "Homicidio"
                    ? iconKill
                    : ""
            }
          ></img>
        </div>
      </div>

      <LoadCrimesInNeighborhoods
        categoryCrime={categoryCrime}
        setElementSearchedNotFound={setElementSearchedNotFound}
      />

      <Table
        crime={categoryCrime}
        elementSearchedNotFound={elementSearchedNotFound}
      />
    </div>
  );
};
