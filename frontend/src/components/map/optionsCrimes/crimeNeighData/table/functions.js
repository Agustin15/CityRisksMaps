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
    if (
      polygon.data.name == neighborhood &&
      polygon.strokeColor != "#00bd10ff"
    ) {
      polygon.setOptions({
        strokeColor: "#00bd10ff",
        strokeOpacity: 1.0,
        strokeWeight: 11
      });
    } else {
      polygon.setOptions({
        strokeColor: "#8d8d8dff",
        strokeOpacity: 1.0,
        strokeWeight: 1
      });
    }
  });

  let bounds = new google.maps.LatLngBounds();
  nhCoordinatesFound.coordinates.map((nhCoordinate) =>
    bounds.extend(nhCoordinate)
  );

  map.setZoom(15);
  map.panTo(bounds.getCenter());
};

export const calculateAmountCrime = (neighborhoodsCrimeByYear) => {
  const amount = neighborhoodsCrimeByYear.reduce((acc, neighborhoodsCrime) => {
    if (neighborhoodsCrime.quantityCrime != null) {
      acc += neighborhoodsCrime.quantityCrime;
    }
    return acc;
  }, 0);
  return amount;
};

export const calculateAmountRateCrime = (neighborhoodsCrimeByYear) => {
  const amountCrime = calculateAmountCrime(neighborhoodsCrimeByYear);

  const amountPopulation = neighborhoodsCrimeByYear.reduce(
    (acc, neighborhoodsCrime) => (acc += neighborhoodsCrime.quantityPopulation),
    0
  );

  return ((amountCrime / amountPopulation) * 100000).toFixed(0);
};
