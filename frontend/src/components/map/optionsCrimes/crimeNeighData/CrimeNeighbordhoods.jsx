import styles from "./CrimeNeighbordhoods.module.css";
import iconKill from "../../../../assets/img/kill.png";
import iconTheft from "../../../../assets/img/theft.png";
import iconHoldup from "../../../../assets/img/holdup.png";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { Table } from "./table/Table";
import { LoadCrimesInNeighborhoods } from "./loadCrimeDataNeighborhoods/LoadCrimeDataNeighborhoods";

export const CrimeNeighbordhoods = ({ categoryCrime }) => {
  const { handleClose } = useZoneCrimes();
  
  return (
    <div className={styles.containData}>
      <div className={styles.header}>
        <div className={styles.close}>
          <button onClick={handleClose}>x</button>
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
