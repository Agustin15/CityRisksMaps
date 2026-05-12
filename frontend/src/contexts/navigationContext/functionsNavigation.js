const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { alertSwalError } from "../../components/sweetAlert/sweetAlert.js";

export const getNewRoute = async (
  newOriginLocation,
  destinationLocation,
  transportSelected,
  intermediates
) => {
  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.polyline,routes.polyline.encodedPolyline,routes.legs"
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: newOriginLocation
            }
          },
          destination: {
            location: { latLng: destinationLocation }
          },
          intermediates:
            intermediates && intermediates.length > 0 ? intermediates : [],
          travelMode: transportSelected,
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false
          },
          languageCode: "es-419"
        })
      }
    );
    const result = await response.json();

    if (!response.ok) throw new Error(result.error.message);

    return result;
  } catch (error) {
    alertSwalError(
      "Ups,ruta no encontrada",
      "Hubo un error al recalcular la ruta"
    );
  }
};
