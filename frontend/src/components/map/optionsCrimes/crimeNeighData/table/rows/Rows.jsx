import styles from "../Table.module.css";
import { useZoneCrimes } from "../../../../../../contexts/ZoneCrimesContext";
import { ColorRate } from "../colorRate/ColorRate";
import { Chart } from "../chart/Chart";

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
    } else setIndexChartActive(numberRow);
    handleClickNeighborhood(neighborhoodCrime);
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
                neighborhoodCrime.quantiyCrime == null
                  ? null
                  : defineCrimeRate(
                      neighborhoodCrime.quantiyCrime,
                      neighborhoodCrime.quantiyPopulation
                    )
              }
              crime={crime}
            />
            {neighborhoodCrime.name}
          </div>
        </td>
        <td>
          {neighborhoodCrime.quantiyCrime == null
            ? "Sin Datos"
            : neighborhoodCrime.quantiyCrime}
        </td>
        <td>{neighborhoodCrime.quantiyPopulation.toLocaleString()}</td>
        <td>
          {neighborhoodCrime.quantiyCrime == null
            ? "Sin Datos"
            : defineCrimeRate(
                neighborhoodCrime.quantiyCrime,
                neighborhoodCrime.quantiyPopulation
              )}
        </td>
      </tr>
      {indexChartActive == numberRow && (
        <tr>
          <td colSpan={4}>
            {
              <Chart
                categoryCrime={crime}
                nameNeighborhood={neighborhoodCrime.name}
              />
            }
          </td>
        </tr>
      )}
    </>
  );
};
