import styles from "../Table.module.css";
import iconDecrease from "../../../../../assets/img/decrease.png";
import iconIncrease from "../../../../../assets/img/increase.png";
import { useNeighborhoodsCrimes } from "../../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useWindowResize } from "../../../../../contexts/WindowResizeContext";
import { useInteractionNeighborhoodsPolygons } from "../../../../../contexts/neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext";
import { ColorRate } from "../colorRate/ColorRate";
import { Activity } from "react";
import { DetailsRow } from "./detailsRow/DetailsRow";

export const Rows = ({ neighborhoodCrime, crime, numberRow }) => {
  const { indexChartActive, setIndexChartActive } = useNeighborhoodsCrimes();
  const { windowWidth } = useWindowResize();
  const { focusPolygon } = useInteractionNeighborhoodsPolygons();

  const handleClickRow = () => {
    if (indexChartActive == numberRow) {
      setIndexChartActive(null);
    } else {
      setIndexChartActive(numberRow);
    }

     focusPolygon(neighborhoodCrime.name);
  };

  const yearNotFinished = (year) => {
    return year == new Date().getFullYear() && new Date().getMonth() < 12;
  };

  return (
    <>
      <tr
        onClick={() => handleClickRow()}
        key={numberRow}
        className={numberRow % 2 == 0 ? styles.trGray : styles.trWhite}
      >
        <td>
          <div className={styles.nameNeighborhood}>
            <ColorRate rate={neighborhoodCrime.rate} crime={crime} />
            {neighborhoodCrime.name}
          </div>
        </td>
        <td>
          {neighborhoodCrime.quantityCrime == null
            ? "Sin Datos"
            : neighborhoodCrime.quantityCrime}
        </td>

        <td>{neighborhoodCrime.quantityPopulation.toLocaleString()}</td>
        <td>{neighborhoodCrime.rate}</td>
        <td
          className={
            yearNotFinished(neighborhoodCrime.yearCrime)
              ? ""
              : neighborhoodCrime.increase < 0
                ? styles.decrease
                : neighborhoodCrime.increase > 0
                  ? styles.increase
                  : ""
          }
        >
          {!yearNotFinished(neighborhoodCrime.yearCrime) &&
            neighborhoodCrime.increase != null &&
            neighborhoodCrime.increase != 0 &&
            new Date().getFullYear() != neighborhoodCrime.year && (
              <img
                src={
                  neighborhoodCrime.increase > 0 ? iconIncrease : iconDecrease
                }
              ></img>
            )}

          {yearNotFinished(neighborhoodCrime.yearCrime)
            ? "Año en curso"
            : neighborhoodCrime.increase != null
              ? neighborhoodCrime.increase + "%"
              : "Sin datos"}
        </td>
      </tr>

      <Activity mode={indexChartActive == numberRow ? "visible" : "hidden"}>
        <tr>
          <td colSpan={windowWidth <= 650 ? 2 : 5}>
            <DetailsRow neighborhoodCrime={neighborhoodCrime} crime={crime} />
          </td>
        </tr>
      </Activity>
    </>
  );
};
