import styles from "../Menu.module.css";
import { alertSwalWarning } from "../../../../../sweetAlert/sweetAlert.js";
import { useNeighborhoodsCrimes } from "../../../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext.jsx";

export const Item = ({ crime, setShowViewStatistics, showViewStatistics }) => {
  const {
    loadCrimeDataNeighborhoods,
    crimeSelected,
    setCrimeSelected,
    loadingNeighborhoodsCrime,
    loadingYears,
    handleClose,
  } = useNeighborhoodsCrimes();

  const handleClickOption = (crime) => {
    if (loadingYears || loadingNeighborhoodsCrime) return;

    if (crime.category != crimeSelected) {
      if (!showViewStatistics) setShowViewStatistics(true);

      handleClose();
      loadCrimeDataNeighborhoods(crime.category);
      setCrimeSelected(crime.category);
    } else if (!showViewStatistics) setShowViewStatistics(true);
  };

  return (
    <li
      className={crime.category == crimeSelected ? styles.selected : ""}
      onClick={() => handleClickOption(crime)}
    >
      <div
        className={
          crime.category == "Hurto"
            ? styles.theft
            : crime.category == "Rapiña"
              ? styles.holdup
              : crime.category == "Homicidio"
                ? styles.kill
                : ""
        }
      ></div>
      {crime.category}s
    </li>
  );
};
