import styles from "./ContainQuizes.module.css";
import { useQuizes } from "../../../../contexts/QuizesContext";
import iconQuizes from "../../../../assets/img/quizes.png";
import { Table } from "../Table";
import { LoadDataQuizes } from "../loadDataQuizes/LoadDataQuizes";
import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";

export const ContainQuizes = () => {
  const { setShowQuizes, setNeighborhoodsQuizesByYear } = useQuizes();
  const { setYears, setYearSelected, setPolygons, polygons } = useZoneCrimes();

  const handleClose = () => {
    if (polygons.length > 0) {
      polygons.forEach((polygon) => {
        polygon.setMap(null);
      });
      setPolygons([]);
    }

    setNeighborhoodsQuizesByYear();
    setYears();
    setYearSelected();
    setShowQuizes(false);
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

      <LoadDataQuizes />

      <Table />
    </div>
  );
};
