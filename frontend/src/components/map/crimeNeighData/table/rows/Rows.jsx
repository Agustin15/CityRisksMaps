import styles from "../Table.module.css";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { ColorRate } from "../colorRate/ColorRate";
import { Chart } from "../../../chart/Chart";
import { PolygonDraw } from "../polygonDraw/PolygonDraw";

export const Rows = ({
  handleClickNeighborhood,
  neighborhoodCrime,
  crime,
  numberRow
}) => {
  const { defineCrimeRate, indexChartActive, setIndexChartActive } =
    useZoneCrimes();

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
      {indexChartActive == numberRow && (
        <tr>
          <td colSpan={4}>
            {
              <div className={styles.moreDetails}>
                <h4>{neighborhoodCrime.name}</h4>
                <PolygonDraw
                  neighborhoodCrime={neighborhoodCrime}
                  categoryCrime={crime}
                />
                <Chart
                  categoryCrime={crime}
                  nameNeighborhood={neighborhoodCrime.name}
                />
              </div>
            }
          </td>
        </tr>
      )}
    </>
  );
};
