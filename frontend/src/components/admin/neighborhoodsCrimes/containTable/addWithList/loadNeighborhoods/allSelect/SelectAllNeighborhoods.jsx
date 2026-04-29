import styles from "./SelectAllNeighborhoods.module.css";
import { useState } from "react";

export const SelectAllNeighborhoods = ({
  neighborhoodsSelected,
  setNeighborhoodsSelected
}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);

    if (isChecked) {
      const allSelected = neighborhoodsSelected.map((hood) => ({
        ...hood,
        checked: true
      }));
      setNeighborhoodsSelected(allSelected);
    } else {
      const noneSelected = neighborhoodsSelected.map((hood) => ({
        ...hood,
        checked: false
      }));
      setNeighborhoodsSelected(noneSelected);
    }
  };

  return (
    <div className={styles.selectAllNeighbrohoods}>
      <span>Seleccionar todos los barrios</span>
      <label htmlFor="checkboxAll">
        <div className={styles.ball}></div>
      </label>
      <input
        onChange={(event) => handleSelectAll(event)}
        id="checkboxAll"
        type="checkbox"
      ></input>
    </div>
  );
};
