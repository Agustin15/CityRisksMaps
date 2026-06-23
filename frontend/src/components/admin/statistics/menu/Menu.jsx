import styles from "./Menu.module.css";
import iconChartLine from "../../../../assets/img/chartLine.png";
import iconChartColumn from "../../../../assets/img/columnChart.png";

export const Menu = ({ selected, setSelected }) => {
  return (
    <nav className={styles.menu}>
      <ul>
        <li
          className={selected == "IncreaseCategoryCrime" ? styles.selected : ""}
          onClick={() => setSelected("IncreaseCategoryCrime")}
        >
          <img src={iconChartLine}></img>
          <span>Crecimiento de un crimen</span>
        </li>
        <li
          className={
            selected == "IncreaseCategoryCrimeInHood" ? styles.selected : ""
          }
          onClick={() => setSelected("IncreaseCategoryCrimeInHood")}
        >
          <img src={iconChartLine}></img>

          <span>Crecimiento de crimen en un barrio</span>
        </li>
        <li
          className={
            selected == "AmountDifferentCrimesInNeighborhoodAndYear"
              ? styles.selected
              : ""
          }
          onClick={() =>
            setSelected("AmountDifferentCrimesInNeighborhoodAndYear")
          }
        >
          <img src={iconChartColumn}></img>
          <span>Crimenes en barrio por año</span>
        </li>
        <li
          className={
            selected == "AmountOfCrimeInNeighborhoodsByYear"
              ? styles.selected
              : ""
          }
          onClick={() => setSelected("AmountOfCrimeInNeighborhoodsByYear")}
        >
          <img src={iconChartColumn}></img>
          <span>Crimen en barrios por año</span>
        </li>
      </ul>
    </nav>
  );
};
