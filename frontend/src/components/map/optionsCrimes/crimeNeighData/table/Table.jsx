import styles from "./Table.module.css";
import { useZoneCrimes } from "../../../../../contexts/ZoneCrimesContext";
import { useMapControls } from "../../../../../contexts/MapContext";
import { useMap } from "@vis.gl/react-google-maps";
import { NotData } from "../../../notData/NotData";
import { Loading } from "../../../loading/Loading";
import { Rows } from "./rows/Rows";

export const Table = ({ crime }) => {
  const { neighbordhoodsCoordinates } = useMapControls();
  const { polygons, neighborhoodsCrimeByYear, loadingNeighborhoodsCrime } =
    useZoneCrimes();
  const map = useMap();

  const handleClickNeighborhood = (neighborhoodCrime) => {
    const nhCoordinatesFound = neighbordhoodsCoordinates.find(
      (nhCoordinates) => nhCoordinates.neighborhood == neighborhoodCrime.name
    );

    polygons.forEach((polygon) => {
      polygon.setOptions({
        strokeColor: "#8d8d8dff",
        strokeOpacity: 1,
        strokeWeight: 1
      });
    });

    let bounds = new google.maps.LatLngBounds();
    nhCoordinatesFound.coordinates.map((nhCoordinate) =>
      bounds.extend(nhCoordinate)
    );

    map.setZoom(15);
    map.panTo(bounds.getCenter());

    const polygonFound = polygons.find(
      (polygon) => polygon.data.name == neighborhoodCrime.name
    );

    if (polygonFound) {
      polygonFound.setOptions({
        strokeColor: "#00bd10ff",
        strokeOpacity: 1.0,
        strokeWeight: 11
      });
    }
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
                Poblacion
                {neighborhoodsCrimeByYear &&
                  neighborhoodsCrimeByYear[0].yearPopulation}
              </th>
              <th>Tasa 100.000 habits.</th>
            </tr>
          </thead>

          <tbody>
            {loadingNeighborhoodsCrime && (
              <tr>
                <td colSpan={4} rowSpan={4}>
                  <Loading />
                </td>
              </tr>
            )}
            {!loadingNeighborhoodsCrime && !neighborhoodsCrimeByYear && (
              <tr>
                <td colSpan={4} rowSpan={4}>
                  <NotData />
                </td>
              </tr>
            )}
            {!loadingNeighborhoodsCrime &&
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
        </table>
      </div>
    </div>
  );
};
