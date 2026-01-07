import { verifyPolygonsBelongToRoute } from "../../../../../contexts/routesContext/functions.js";

export const calculateRangeDangerStep = (step, polygons) => {
  const coordinatesStep = new google.maps.geometry.encoding.decodePath(
    step.polyline.encodedPolyline
  );

  const polygonsBelong = verifyPolygonsBelongToRoute(coordinatesStep, polygons);

  const polygonsAndDistance = polygonsBelong.map((polygon) => {
    const coordinatesBelongPolygon = [];

    coordinatesStep.forEach((latLng) => {
      if (new google.maps.geometry.poly.containsLocation(latLng, polygon)) {
        coordinatesBelongPolygon.push(latLng);
      }
    });

    const distanceMeters = google.maps.geometry.spherical.computeLength(
      coordinatesBelongPolygon
    );
    return {
      polygon: polygon,
      distanceMetersInPolygon: distanceMeters
    };
  });
  return polygonsAndDistance;
};
