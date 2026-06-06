import { useRef } from "react";
import { formatDate } from "../../../functions.js";
import styles from "./Dates.module.css";

export const Dates = ({ dates, setDateSelected }) => {
  const selectRef = useRef();

  return (
    <div className={styles.dates}>
      <span>Buscar por fecha:</span>
      <select ref={selectRef}>
        {dates.map((date, index) => (
          <option value={date} key={index}>
            {formatDate(new Date(new Date(date).setHours(24)), true)}
          </option>
        ))}
      </select>

      <button onClick={() => setDateSelected(selectRef.current.value)}>
        Buscar
      </button>
    </div>
  );
};
