import { getCrimeRange } from "../../../../contexts/neighborhoodsCrimesContext/functionsCreatePolygons.js";
import { alertSwalError } from "../../../sweetAlert/sweetAlert.js";
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const boundsMontevideo = async () => {
  try {
    const response = await fetch(LOCALHOST_FRONTEND + "/montevideo.json");
    const result = await response.json();

    if (!response.ok)
      throw new Error(
        "Hubo un error al cargar las coordenadas de la ciudad de Montevideo"
      );

    if (result) {
      const coordinatesMdveo = result.features[0].geometry.coordinates
        .flat()
        .flat();

      let bounds = new google.maps.LatLngBounds();

      if (coordinatesMdveo) {
        coordinatesMdveo.forEach((coordinate) =>
          bounds.extend({ lat: coordinate[1], lng: coordinate[0] })
        );

        return bounds;
      }
    }
  } catch (error) {
    alertSwalError("Ups, algo salio mal", error);
  }
};

export const createCoordinatesNeighborhoods = async () => {
  const features = await fetchGetCoordinatesNeighborhoods();

  if (!features) return;

  const neighborhoodsCoordinates = features.map((feature) => {
    return {
      name: feature.properties.nombre,
      coordinates: feature.geometry.coordinates.flat().map((coordinate) => {
        return { lat: coordinate[1], lng: coordinate[0] };
      })
    };
  });
  return neighborhoodsCoordinates;
};

const fetchGetCoordinatesNeighborhoods = async () => {
  try {
    const response = await fetch(LOCALHOST_FRONTEND + "/barrios.json");
    const result = await response.json();

    if (result) return result.features;
  } catch (error) {
    alertSwalError(
      "Ups, algo salio mal",
      "Hubo un error al cargar las coordenadas de los barrios"
    );
  }
};

export const createPolygons = (
  neighborhoodsCoordinates,
  neighborhoodsCrimes,
  map
) => {
  const polygonsCreated = [];

  neighborhoodsCrimes.map((neighborhoodCrime) => {
    const neighborhoodFound = neighborhoodsCoordinates.find(
      (hoodCoordinate) => hoodCoordinate.name == neighborhoodCrime.name
    );

    if (neighborhoodFound.coordinates) {
      let colorRange = null;
      let levelRange = null;

      if (neighborhoodCrime.rate != null) {
        const range = getCrimeRange(
          neighborhoodCrime.rate.toFixed(0),
          neighborhoodCrime.crime
        );

        colorRange = range.color;
        levelRange = range.level;
      }

      const bounds = new google.maps.LatLngBounds();
      neighborhoodFound.coordinates.map((latLng) => bounds.extend(latLng));

      const polygon = new google.maps.Polygon({
        paths: neighborhoodFound.coordinates,
        fillColor: colorRange,
        fillOpacity: 0.4,
        strokeColor: "#8d8d8dff",
        strokeOpacity: 1,
        strokeWeight: 1,
        clickable: false,
        data: {
          neighborhood: neighborhoodCrime.name,
          crime: neighborhoodCrime.crime,
          yearCrime: neighborhoodCrime.year,
          amount: neighborhoodCrime.quantity,
          rate: neighborhoodCrime.rate,
          rateLevel: levelRange ? levelRange : "Sin datos",
          rateColor: colorRange ? colorRange : "#bbbbbbff",
          coordinates: neighborhoodFound.coordinates,
          center: bounds.getCenter()
        },
        map: map
      });

      polygonsCreated.push(polygon);
    }
  });

  return polygonsCreated;
};
