const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { alertSwalError } from "../../components/sweetAlert/sweetAlert.js";

export const getUserStep = (
  routeNavigation,
  userLocation,
  transportSelected
) => {
  let toleranceGrades, indexCurrentStepFound;

  const stepCurrentFound = routeNavigation.legs[0].steps.find((step, index) => {
    const polylineStep = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(
        step.polyline.encodedPolyline
      )
    });

    ///1 grado longitud equivale 111319 metros
    if (
      transportSelected == "Drive" ||
      transportSelected == "Transit" ||
      transportSelected == "Two_wheeler"
    )
      toleranceGrades = 30 / 111319;
    else toleranceGrades = 15 / 111319;

    const userInStep = google.maps.geometry.poly.isLocationOnEdge(
      userLocation,
      polylineStep,
      toleranceGrades
    );

    if (userInStep == true) {
      indexCurrentStepFound = index;
      return step;
    }
  });

  return {
    stepFound: stepCurrentFound,
    indexStepFound: indexCurrentStepFound
  };
};

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
          intermediates: intermediates ? intermediates : [],
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
