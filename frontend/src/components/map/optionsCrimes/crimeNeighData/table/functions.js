export const focusPolygon = (
  neighbordhoodsCoordinates,
  neighborhood,
  polygons,
  map
) => {
  const nhCoordinatesFound = neighbordhoodsCoordinates.find(
    (nhCoordinates) => nhCoordinates.neighborhood == neighborhood
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
    (polygon) => polygon.data.name == neighborhood
  );

  if (polygonFound) {
    polygonFound.setOptions({
      strokeColor: "#00bd10ff",
      strokeOpacity: 1.0,
      strokeWeight: 11
    });
  }
};

export const amountCrime = (neighborhoodsCrimeByYear) => {
  const amount = neighborhoodsCrimeByYear.reduce((acc, neighborhoodsCrime) => {
    if (neighborhoodsCrime.quantityCrime != null) {
      acc += neighborhoodsCrime.quantityCrime;
    }
    return acc;
  }, 0);
  return amount;
};

export const amountRateCrime = (neighborhoodsCrimeByYear, defineCrimeRate) => {
  const amount = neighborhoodsCrimeByYear.reduce((acc, neighborhoodCrime) => {
    if (neighborhoodCrime.quantityCrime != null) {
      acc += defineCrimeRate(
        neighborhoodCrime.quantityCrime,
        neighborhoodCrime.quantityPopulation
      );
    }
    return acc;
  }, 0);
  return amount;
};
