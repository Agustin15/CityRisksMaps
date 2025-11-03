import styles from "./CrimeNeighbordhoods.module.css";
import iconKill from "../../../../assets/img/kill.png";
import iconTheft from "../../../../assets/img/theft.png";
import iconHoldup from "../../../../assets/img/holdup.png";
import { useState } from "react";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { Table } from "./table/Table";
import { LoadCrimesInNeighborhoods } from "./loadCrimeDataNeighborhoods/LoadCrimeDataNeighborhoods";

export const CrimeNeighbordhoods = ({ categoryCrime, setCrimeSelected }) => {
  const { polygons, setPolygons, loadingNeighborhoodsCrime } = useZoneCrimes();

  const [neighborhoodsCrimeByYear, setNeighborhoodsCrimeByYear] = useState();

  const handleClose = () => {
    polygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setCrimeSelected();
    setPolygons([]);
  };

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
                ? iconTheft
                : categoryCrime == "Rapiña"
                ? iconHoldup
                : categoryCrime == "Asesinato"
                ? iconKill
                : ""
            }
          ></img>
        </div>
      </div>

      <LoadCrimesInNeighborhoods
        setNeighborhoodsCrimeByYear={setNeighborhoodsCrimeByYear}
        categoryCrime={categoryCrime}
      />

      {neighborhoodsCrimeByYear && (
        <Table
          neighborhoodsCrimeByYear={neighborhoodsCrimeByYear}
          crime={categoryCrime}
        />
      )}
    </div>
  );
};
