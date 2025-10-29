import styles from "./Table.module.css";
import { useZoneCrimes } from "../../../../../contexts/ZoneCrimesContext";

export const Table = ({ neighborhoodsCrimeByYear }) => {
  const { defineCrimeRate, defineCrimeRange } = useZoneCrimes();

  return (
    <div className={styles.containTable}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Barrio</th>
              <th>Cantidad</th>
              <th>Poblacion {neighborhoodsCrimeByYear[0].yearPopulation}</th>
              <th>Tasa 100.000 habits.</th>
            </tr>
          </thead>

          <tbody>
            {neighborhoodsCrimeByYear.map((neighborhoodCrime, index) => (
              <tr
                key={index}
                className={index % 2 == 0 ? styles.trGray : styles.trWhite}
              >
                <td>
                  <div className={styles.nameNeighborhood}>
                    {neighborhoodCrime.name}
                  </div>
                </td>
                <td>
                  {neighborhoodCrime.quantiyCrime
                    ? neighborhoodCrime.quantiyCrime
                    : "Sin Datos"}
                </td>
                <td>{neighborhoodCrime.quantiyPopulation.toLocaleString()}</td>
                <td>
                  {neighborhoodCrime.quantiyCrime
                    ? defineCrimeRate(
                        neighborhoodCrime.quantiyCrime,
                        neighborhoodCrime.quantiyPopulation
                      )
                    : "Sin datos"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
