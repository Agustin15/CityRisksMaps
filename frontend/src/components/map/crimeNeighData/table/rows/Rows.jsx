import styles from "../Table.module.css";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useWindowResize } from "../../../../../contexts/WindowResizeContext";
import { ColorRate } from "../colorRate/ColorRate";
import { Activity } from "react";
import { DetailsRow } from "./detailsRow/DetailsRow";

export const Rows = ({
  handleClickNeighborhood,
  neighborhoodCrime,
  crime,
  numberRow
}) => {
  const { defineCrimeRate, indexChartActive, setIndexChartActive } =
    useZoneCrimes();
  const { windowWidth } = useWindowResize();

  const handleClickRow = () => {
    if (indexChartActive == numberRow) {
      setIndexChartActive(null);
    } else {
      setIndexChartActive(numberRow);
    }

    handleClickNeighborhood(neighborhoodCrime.name);
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
            <ColorRate
              rate={
                neighborhoodCrime.quantityCrime == null
                  ? null
                  : defineCrimeRate(
                      neighborhoodCrime.quantityCrime,
                      neighborhoodCrime.quantityPopulation
                    )
              }
              crime={crime}
            />
            {neighborhoodCrime.name}
          </div>
        </td>
        <td>
          {neighborhoodCrime.quantityCrime == null
            ? "Sin Datos"
            : neighborhoodCrime.quantityCrime}
        </td>
        <td>{neighborhoodCrime.quantityPopulation.toLocaleString()}</td>
        <td>
          {neighborhoodCrime.quantityCrime == null
            ? "Sin Datos"
            : defineCrimeRate(
                neighborhoodCrime.quantityCrime,
                neighborhoodCrime.quantityPopulation
              )}
        </td>
      </tr>
      <Activity mode={indexChartActive == numberRow ? "visible" : "hidden"}>
        <tr>
          <td colSpan={windowWidth <= 650 ? 2 : 4}>
            <DetailsRow neighborhoodCrime={neighborhoodCrime} crime={crime} />
          </td>
        </tr>
      </Activity>
    </>
  );
};
