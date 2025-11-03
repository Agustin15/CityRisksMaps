import styles from "./Table.module.css";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { ColorRate } from "./colorRate/ColorRate";
import { useMapControls } from "../../../../../contexts/MapContext";
import { useMap } from "@vis.gl/react-google-maps";

export const Table = ({ neighborhoodsCrimeByYear, crime }) => {
  const { defineCrimeRate, polygons } = useZoneCrimes();
  const { neighbordhoodsCoordinates } = useMapControls();
  const map = useMap();

  const handleClickNeighborhood = (event, neighborhoodCrime) => {
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
              <th>Poblacion {neighborhoodsCrimeByYear[0].yearPopulation}</th>
              <th>Tasa 100.000 habits.</th>
            </tr>
          </thead>

          <tbody>
            {neighborhoodsCrimeByYear.map((neighborhoodCrime, index) => (
              <tr
                onClick={(event) =>
                  handleClickNeighborhood(event, neighborhoodCrime)
                }
                key={index}
                className={index % 2 == 0 ? styles.trGray : styles.trWhite}
              >
                <td>
                  <div className={styles.nameNeighborhood}>
                    <ColorRate
                      rate={
                        neighborhoodCrime.quantiyCrime
                          ? defineCrimeRate(
                              neighborhoodCrime.quantiyCrime,
                              neighborhoodCrime.quantiyPopulation
                            )
                          : null
                      }
                      crime={crime}
                    />
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
