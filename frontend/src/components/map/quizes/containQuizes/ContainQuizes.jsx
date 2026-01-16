import styles from "./ContainQuizes.module.css";
import iconQuizes from "../../../../assets/img/quizes.png";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { Table } from "../Table";
import { LoadDataQuizes } from "../loadDataQuizes/LoadDataQuizes";

export const ContainQuizes = ({
  showViewStatistics,
  setShowViewStatistics
}) => {
  const { setShowQuizes, setNeighborhoodsQuizesByYear } = useQuizes();
  const {
    setYears,
    setYearSelected,
    setPolygons,
    polygons,
    setIndexChartActive
  } = useZoneCrimes();

  const handleClose = () => {
    if (polygons.length > 0) {
      polygons.forEach((polygon) => {
        polygon.setMap(null);
      });
      setPolygons([]);
    }

    setIndexChartActive(null);
    setNeighborhoodsQuizesByYear();
    setYears();
    setYearSelected();
    setShowQuizes(false);
  };

  return (
    <div className={styles.containData}>
      <div className={styles.header}>
        <div className={styles.close}>
          <button
            onClick={() => {
              if (showViewStatistics) setShowViewStatistics(false);
              handleClose();
            }}
          >
            x
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
