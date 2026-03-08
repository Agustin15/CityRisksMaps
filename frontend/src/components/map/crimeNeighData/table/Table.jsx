import styles from "./Table.module.css";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useMapControls } from "../../../../contexts/MapContext";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { useMap } from "@vis.gl/react-google-maps";
import { NotData } from "../../notData/NotData";
import { Loading } from "../../loading/Loading";
import { Rows } from "./rows/Rows";
import { Tfoot } from "./tfoot/Tfoot.jsx";
import { focusPolygon } from "./functions.js";

export const Table = ({ crime }) => {
  const { neighbordhoodsCoordinates } = useMapControls();
  const { windowWidth } = useWindowResize();

  const {
    polygons,
    neighborhoodsCrimeByYear,
    loadingNeighborhoodsCrime,
    loadingYears,
    tableRef
  } = useZoneCrimes();
  const map = useMap();

  const handleClickNeighborhood = (neighborhood) => {
    focusPolygon(neighbordhoodsCoordinates, neighborhood, polygons, map);
  };

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
                handleClickNeighborhood={handleClickNeighborhood}
                crime={crime}
                numberRow={index}
              />
            ))}
        </tbody>

        {loadingNeighborhoodsCrime == false && neighborhoodsCrimeByYear && (
          <Tfoot
            neighborhoodsCrimeByYear={neighborhoodsCrimeByYear}
            crime={crime}
          />
        )}
      </table>
    </div>
  );
};
