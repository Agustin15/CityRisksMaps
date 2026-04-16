import { alertSwalError } from "../../../../../sweetAlert/sweetAlert.js";

export const createIntermediates = (
  polygons,
  routeNavigation,
  destinationLocation,
  warning,
  map
) => {
  let polygonsLatLngCenter = [];
  const polygonDangerAlreadyDeflected = [];
  const coordinatesOutsidePolygonDanger = [];

  const path = google.maps.geometry.encoding.decodePath(
    routeNavigation.polyline.encodedPolyline
  );

  const latLngDestination = new google.maps.LatLng(
    destinationLocation.latitude,
    destinationLocation.longitude
  );

  const polygonDestination = polygons.find((polygon) =>
    google.maps.geometry.poly.containsLocation(latLngDestination, polygon)
  );

  for (const latLng of path) {
    const polygonDanger = verifyIfLatlngPassByPolygonDanger(latLng, polygons);

    if (
      verifyToSkipCoordinate(
        polygonDanger,
        polygonDestination,
        polygonDangerAlreadyDeflected,
        warning
      )
    )
      continue;

    polygons.forEach((polygon) => {
      const bounds = new google.maps.LatLngBounds();

      polygon.getPath().mh.forEach((latLng) => {
        bounds.extend(latLng);
      });

      if (
        polygonDestination.data.name == polygon.data.name ||
        warning.neighborhood == polygon.data.name ||
        polygon.data.rateLevel == "Alta" ||
        polygon.data.rateLevel == "Muy alta"
      )
        return;

      polygonsLatLngCenter.push(bounds.getCenter());
    });

    polygonsLatLngCenter = filterByHeadingWestAndEast(
      polygonsLatLngCenter,
      latLng,
      map
    );

    if (polygonsLatLngCenter.length == 0)
      return alertSwalError(
        "Ups, no se pudo encontrar una mejor ruta",
        "No se encontro un barrio con bajos indices de delitos para realizar una mejor ruta"
      );

    const latLngOutsidePolygonDanger = getCoordinateOutsideMostClosest(
      latLng,
      polygonsLatLngCenter
    );

    if (
      google.maps.geometry.spherical.computeDistanceBetween(
        latLng,
        latLngOutsidePolygonDanger
      ) >= 10000
    )
      return alertSwalError(
        "Ups, no se pudo encontrar una mejor ruta",
        "No se encontro un barrio cercano con bajos indices de delitos para realizar una mejor ruta"
      );

    polygonDangerAlreadyDeflected.push(polygonDanger);
    coordinatesOutsidePolygonDanger.push({
      location: {
        latLng: {
          latitude: latLngOutsidePolygonDanger.lat(),
          longitude: latLngOutsidePolygonDanger.lng()
        }
      }
    });
  }

  if (coordinatesOutsidePolygonDanger.length == 0)
    return alertSwalError(
      "Ups, no es necesario desviar la ruta",
      "La ruta no intercepta con ningun barrio con altos indices de delitos"
    );
  return coordinatesOutsidePolygonDanger;
};

const verifyIfLatlngPassByPolygonDanger = (latLng, polygons) => {
  const polygonDanger = polygons.find((polygon) => {
    const inPolygon = google.maps.geometry.poly.containsLocation(
      latLng,
      polygon
    );

    if (
      inPolygon &&
      (polygon.data.rateLevel == "Alta" || polygon.data.rateLevel == "Muy alta")
    )
      return polygon;
  });

  return polygonDanger;
};

export const filterByHeadingWestAndEast = (
  polygonsLatLngCenter,
  latLng,
  map
) => {
  return polygonsLatLngCenter.filter((center) => {
    const heading = google.maps.geometry.spherical.computeHeading(
      latLng,
      center
    );

    if (
      (heading >= 15 && heading <= 90) ||
      (heading >= -90 && heading <= -15)
    ) {
      return center;
    }
  });
};

const verifyToSkipCoordinate = (
  polygonDanger,
  polygonDestination,
  polygonDangerAlreadyDeflected,
  warning
) => {
  let foundDeflectedPolygon = null;

  if (polygonDangerAlreadyDeflected.length > 0 && polygonDanger) {
    foundDeflectedPolygon = polygonDangerAlreadyDeflected.some(
      (polygon) => polygon.data.name == polygonDanger.data.name
    );
  }

  if (
    !polygonDanger ||
    polygonDanger.data.name == warning.neighborhood ||
    polygonDanger.data.name == polygonDestination.data.name ||
    foundDeflectedPolygon
  )
    return true;
  else return false;
};

const getCoordinateOutsideMostClosest = (latLng, polygonsLatLngCenter) => {
  let latLngCenterMostClosest = polygonsLatLngCenter[0];
  let distanceSelected = google.maps.geometry.spherical.computeDistanceBetween(
    polygonsLatLngCenter[0],
    latLng
  );

  polygonsLatLngCenter.forEach((latLngCenter) => {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      latLngCenter,
      latLng
    );

    const heading = google.maps.geometry.spherical.computeHeading(
      latLng,
      latLngCenter
    );

    if (distance < distanceSelected) {
      distanceSelected = distance;
      latLngCenterMostClosest = latLngCenter;
    } else return;
  });

  const heading = google.maps.geometry.spherical.computeHeading(
    latLng,
    latLngCenterMostClosest
  );

  const latLngOutsidePolygonDanger =
    google.maps.geometry.spherical.computeOffset(
      latLng,
      distanceSelected - 400,
      heading
    );

  return latLngOutsidePolygonDanger;
};
