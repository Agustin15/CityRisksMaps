import styles from "./Table.module.css";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext.jsx";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { useMap } from "@vis.gl/react-google-maps";
import { NotData } from "../../notData/NotData";
import { Loading } from "../../loading/Loading";
import { Rows } from "./rows/Rows";
import { Tfoot } from "./tfoot/Tfoot.jsx";

export const Table = ({ crime, elementSearchedNotFound }) => {
  const { windowWidth } = useWindowResize();
  const {
    neighborhoodsCrimeByYear,
    loadingNeighborhoodsCrime,
    loadingYears,
    tableRef
  } = useNeighborhoodsCrimes();
  const map = useMap();

  return (
    <div className={styles.containTable}>
      <table ref={tableRef} className={styles.table}>
        <thead>
          <tr>
            <th>Barrio</th>
            <th>Cantidad</th>
            <th>
              Poblacion{" "}
              {neighborhoodsCrimeByYear &&
                neighborhoodsCrimeByYear[0].yearPopulation}
            </th>
            <th>Tasa 100.000 habits.</th>
            <th>Crecimiento</th>
          </tr>
        </thead>

        <tbody>
          {loadingNeighborhoodsCrime == true && (
            <tr>
              <td
                colSpan={windowWidth <= 650 ? 2 : 5}
                rowSpan={windowWidth <= 650 ? 2 : 5}
              >
                <Loading />
              </td>
            </tr>
          )}
          {loadingYears == false &&
            loadingNeighborhoodsCrime == false &&
            !neighborhoodsCrimeByYear && (
              <tr>
                <td
                  colSpan={windowWidth <= 650 ? 2 : 5}
                  rowSpan={windowWidth <= 650 ? 2 : 5}
                >
                  <NotData />
                </td>
              </tr>
            )}
          {loadingNeighborhoodsCrime == false &&
            neighborhoodsCrimeByYear &&
            neighborhoodsCrimeByYear.map((neighborhoodCrime, index) => (
              <Rows
                key={index}
                neighborhoodCrime={neighborhoodCrime}
                crime={crime}
                numberRow={index}
              />
            ))}
        </tbody>

        {loadingNeighborhoodsCrime == false && neighborhoodsCrimeByYear && (
          <Tfoot
            neighborhoodsCrimeByYear={neighborhoodsCrimeByYear}
            crime={crime}
            elementSearchedNotFound={elementSearchedNotFound}
          />
        )}
      </table>
    </div>
  );
};
