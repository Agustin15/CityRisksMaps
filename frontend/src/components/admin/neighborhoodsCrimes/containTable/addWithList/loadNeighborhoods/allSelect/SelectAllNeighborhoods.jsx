import { useAddNeighborhoodCrime } from "../../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";
import styles from "./SelectAllNeighborhoods.module.css";
import { useEffect, useState } from "react";

export const SelectAllNeighborhoods = () => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const { setValues, values, refCheckboxSelectAll } = useAddNeighborhoodCrime();

  const handleSelectAll = (e) => {
    const isChecked = refCheckboxSelectAll.current.checked;

    setIsAllSelected(isChecked);

    if (isChecked) {
      const allSelected = values.neighborhoodsCrime.map((hood) => ({
        ...hood,
        amount: 0
      }));
      setValues({ ...values, neighborhoodsCrime: allSelected });
    } else {
      const noneSelected = values.neighborhoodsCrime.map((hood) => ({
        ...hood,
        amount: null
      }));
      setValues({ ...values, neighborhoodsCrime: noneSelected });
    }
  };

  return (
    <div className={styles.selectAllNeighbrohoods}>
      <span>Seleccionar todos los barrios</span>
      <label htmlFor="checkboxAll">
        <div className={styles.ball}></div>
      </label>
      <input
        ref={refCheckboxSelectAll}
        onChange={() => handleSelectAll()}
        id="checkboxAll"
        type="checkbox"
      ></input>
    </div>
  );
};
