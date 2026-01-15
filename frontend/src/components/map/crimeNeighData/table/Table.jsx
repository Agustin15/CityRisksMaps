import styles from "./Table.module.css";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useMapControls } from "../../../../contexts/MapContext";
import { useMap } from "@vis.gl/react-google-maps";
import { NotData } from "../../notData/NotData";
import { Loading } from "../../loading/Loading";
import { Rows } from "./rows/Rows";
import { Tfoot } from "./tfoot/Tfoot.jsx";
import { focusPolygon } from "./functions.js";

export const Table = ({ crime }) => {
  const { neighbordhoodsCoordinates } = useMapControls();

  const {
    polygons,
    neighborhoodsCrimeByYear,
    loadingNeighborhoodsCrime,
    loadingYears
  } = useZoneCrimes();
  const map = useMap();

  const handleClickNeighborhood = (neighborhood) => {
    focusPolygon(neighbordhoodsCoordinates, neighborhood, polygons, map);
  };

  return (
    <div className={styles.containTable}>
      <div className={styles.scroll}>
        <table className={styles.table}>
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
            </tr>
          </thead>

          <tbody>
            {loadingNeighborhoodsCrime == true && (
              <tr>
                <td colSpan={4} rowSpan={4}>
                  <Loading />
                </td>
              </tr>
            )}
            {loadingYears == false &&
              loadingNeighborhoodsCrime == false &&
              !neighborhoodsCrimeByYear && (
                <tr>
                  <td colSpan={4} rowSpan={4}>
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
    </div>
  );
};
